import { addPublicationJsonLd } from '@starter-kit/utils/seo/addPublicationJsonLd';
import { getAutogeneratedPublicationOG } from '@starter-kit/utils/social/og';
import request from 'graphql-request';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { HeroPost } from '../components/hero-post';
import { ArticleSVG, ChevronDownSVG, ExternalArrowSVG } from '../components/icons';
import { Layout } from '../components/layout';
import { MorePosts } from '../components/more-posts';
import {
	MorePostsByPublicationDocument,
	MorePostsByPublicationQuery,
	MorePostsByPublicationQueryVariables,
	PageInfo,
	PostFragment,
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
	PublicationFragment,
} from '../generated/graphql';
import { DEFAULT_COVER } from '../utils/const';
import Hero from '../components/hero';
import { Search } from '../components/searchbar';

const SubscribeForm = dynamic(() =>
	import('../components/subscribe-form').then((mod) => mod.SubscribeForm),
);

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type Props = {
	publication: PublicationFragment;
	initialAllPosts: PostFragment[];
	initialPageInfo: PageInfo;
};

export default function Index({ publication, initialAllPosts, initialPageInfo }: Props) {
	const [allPosts, setAllPosts] = useState<PostFragment[]>(initialAllPosts);
	const [pageInfo, setPageInfo] = useState<Props['initialPageInfo']>(initialPageInfo);
	const [loadedMore, setLoadedMore] = useState(false);
	const [entered , setEntered] = useState(false)
	const loadMore = async () => {
		const data = await request<MorePostsByPublicationQuery, MorePostsByPublicationQueryVariables>(
			GQL_ENDPOINT,
			MorePostsByPublicationDocument,
			{
				first: 9,
				host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
				after: pageInfo.endCursor,
			},
		);
		if (!data.publication) {
			return;
		}
		console.log(data)
		const newPosts = data.publication.posts.edges.map((edge) => edge.node);
		setAllPosts([...allPosts, ...newPosts]);
		setPageInfo(data.publication.posts.pageInfo);
		setLoadedMore(true);
	};

	const getData = async () => {
		const data = await request<MorePostsByPublicationQuery, MorePostsByPublicationQueryVariables>(
			GQL_ENDPOINT,
			MorePostsByPublicationDocument,
			{
				first: 10,
				host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
				after: pageInfo.endCursor,
			},
		);
		if (!data.publication) {
			return;
		}
		const newPosts = data.publication.posts.edges.map((edge) => edge.node);
		setAllPosts([...allPosts, ...newPosts]);
		setPageInfo(data.publication.posts.pageInfo);
		setLoadedMore(true);
	};
	const heroPosts = allPosts.slice(0, 3).map((post , i) => {
		return (
			<HeroPost
				key={post.id}
				title={post.title}
				coverImage={post.coverImage?.url || DEFAULT_COVER}
				date={post.publishedAt}
				slug={post.slug}
				excerpt={post.brief}
			/>
		);
	});
	const morePosts = allPosts.slice(3)
	return (
		<AppProvider publication={publication}>
			<Layout>
				<Head>
					<title>
						{publication.displayTitle || publication.title || 'Hashnode Blog Starter Kit'}
					</title>
					<meta
						name="description"
						content={
							publication.descriptionSEO || publication.title || `${publication.author.name}'s Blog`
						}
					/>
					<meta property="twitter:card" content="summary_large_image" />
					<meta
						property="twitter:title"
						content={publication.displayTitle || publication.title || 'Hashnode Blog Starter Kit'}
					/>
					<meta
						property="twitter:description"
						content={
							publication.descriptionSEO || publication.title || `${publication.author.name}'s Blog`
						}
					/>
					<meta
						property="og:image"
						content={publication.ogMetaData.image || getAutogeneratedPublicationOG(publication)}
					/>
					<meta
						property="twitter:image"
						content={publication.ogMetaData.image || getAutogeneratedPublicationOG(publication)}
					/>
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(addPublicationJsonLd(publication)),
						}}
					/>
				</Head>
				<Header/>
				<Container className="flex flex-col dark:bg-gray-900 items-stretch gap-10 px-5 pb-10">
				<Hero/>
					
					<Waypoint onEnter={() => setEntered(true)} />
					{allPosts.length === 0 && (
						<div className="grid  grid-cols-1 py-20 lg:grid-cols-3">
							<div className="col-span-1 flex flex-col items-center gap-5 text-center text-slate-700 dark:text-neutral-400 lg:col-start-2">
								<div className="w-20">
									<ArticleSVG clasName="stroke-current" />
								</div>
								<p className="text-xl font-semibold ">
									Hang tight! We&apos;re drafting the first article.
								</p>
							</div>
						</div>
					)}

					<div style={{
							transform : entered ? 'translateY(0)' : 'translateY(50%)',
							opacity : entered ? '1' : '0',
							transition : `all 200ms 400ms`
						}} className="grid grid-cols-1 animate-up items-start gap-6 md:grid-cols-3">
						
						{heroPosts}
					</div>

					<Search/>

					{morePosts.length > 0 && (
						<>
							<MorePosts context="home" posts={morePosts} />
							
							{pageInfo.hasNextPage && pageInfo.endCursor ? (
								<button className='outline mx-auto text-primary-950 transition-all duration-200 hover:bg-primary-100 py-2 rounded-full px-4 w-fit flex items-center gap-2' onClick={loadMore}> <div className='w-8 h-8'><ChevronDownSVG/></div> Load More</button>
							) : (
								<p className='text-center text-2xl font-bold text-slate-700'>That's all Folks! 👋🏼</p>
							)}
						</>
					)}
					
				</Container>
				<Footer />
			</Layout>
		</AppProvider>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
		GQL_ENDPOINT,
		PostsByPublicationDocument,
		{
			first: 10,
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
		},
	);

	const publication = data.publication;
	if (!publication) {
		return {
			notFound: true,
		};
	}
	const initialAllPosts = publication.posts.edges.map((edge) => edge.node);

	return {
		props: {
			publication,
			initialAllPosts,
			initialPageInfo: publication.posts.pageInfo,
		},
		revalidate: 1,
	};
};