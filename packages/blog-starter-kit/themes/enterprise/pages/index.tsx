import { addPublicationJsonLd } from '@starter-kit/utils/seo/addPublicationJsonLd';
import { getAutogeneratedPublicationOG } from '@starter-kit/utils/social/og';
import request from 'graphql-request';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { Button } from '../components/button';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { HeroPost } from '../components/hero-post';
import { ArticleSVG, ChevronDownSVG } from '../components/icons';
import { Layout } from '../components/layout';
import { MorePosts } from '../components/more-posts';
import { Navbar } from '../components/navbar';
import { SecondaryPost } from '../components/secondary-post';
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

	const loadMore = async () => {
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

	const firstPost = allPosts[0];
	const secondaryPosts = allPosts.slice(1, 4).map((post) => {
		return (
			<SecondaryPost
				key={post.id}
				title={post.title}
				coverImage={post.coverImage?.url || DEFAULT_COVER}
				date={post.publishedAt}
				slug={post.slug}
				excerpt={post.brief}
			/>
		);
	});
	const morePosts = allPosts.slice(4);

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
				<Header />
				<Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
					<Navbar />

					{allPosts.length === 0 && (
						<div className="grid grid-cols-1 py-20 lg:grid-cols-3">
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

					<div className="grid items-start xl:grid-cols-2 border-b border-x border-neutral-200">
						<div className="col-span-1">
							{firstPost && (
								<HeroPost
									title={firstPost.title}
									coverImage={firstPost.coverImage?.url || DEFAULT_COVER}
									date={firstPost.publishedAt}
									slug={firstPost.slug}
									excerpt={firstPost.brief}
								/>
							)}
						</div>
						<div className="col-span-1 flex flex-col">{secondaryPosts}</div>
					</div>

					<Link href="https://www.pakejkahwin.com" target="_blank" rel="noreferrer noopener">
						<div className="w-full h-full lg:flex lg:justify-start lg:items-start border border-neutral-200 lg:flex-row-reverse">
							{/* Image Section */}
							<div className="lg:w-1/2 md:w-full lg:h-fit md:h-auto relative bg-white md:border-b lg:border-l border-neutral-200">
								{/* Example image link */}
								<img className="object-cover w-full h-full" src="/assets/blog/gambar/pakejkahwin.png" alt="Image" />
							</div>

							{/* Content Section */}
								<div className="lg:w-1/2 md:w-full h-full p-8 bg-white border-neutral-200">
									<div className="text-neutral-500 text-xs font-light font-['Outfit'] uppercase leading-[18px] tracking-[4.80px]">PROMOSI</div>
									<div className="text-neutral-800 lg:text-3xl text-2xl font-medium font-['Outfit'] leading-9">Jom cari Dewan Kahwin korang di pakejkahwin.com</div>
										<div className="w-fit mt-8 rounded-full px-8 py-4 bg-primary-500 cursor-pointer">
											<div className="text-center text-white text-base font-medium font-['Outfit'] leading-normal">Lihat Website</div>
										</div>
								</div>
						</div>
					</Link>

					<Link href="https://www.kawenlah.com" target="_blank" rel="noreferrer noopener">
						<div className="w-full h-full lg:flex lg:justify-start lg:items-start border border-neutral-200 lg:flex-row-reverse">
							{/* Image Section */}
							<div className="lg:w-1/2 md:w-full lg:h-fit md:h-auto relative bg-white md:border-b lg:border-l border-neutral-200">
								{/* Example image link */}
								<img className="object-cover w-full h-full" src="/assets/blog/gambar/Kad Kawen.png" alt="Image" />
							</div>

							{/* Content Section */}
							<div className="lg:w-1/2 md:w-full h-full p-8 bg-white border-neutral-200">
								<div className="text-neutral-500 text-xs font-light font-['Outfit'] uppercase leading-[18px] tracking-[4.80px]">KAWENLAH</div>
								<div className="text-neutral-800 lg:text-3xl text-2xl font-medium font-['Outfit'] leading-9">Jom buat Kad Kawen Percuma di website kami!</div>
									<div className="w-fit mt-8 rounded-full px-8 py-4 bg-primary-500 cursor-pointer">
										<div className="text-center text-white text-base font-medium font-['Outfit'] leading-normal">Lihat Website</div>
									</div>
							</div>
						</div>
					</Link>

					<Link href="https://forms.gle/esYMzAg4iKNSwsqCA" target="_blank" rel="noreferrer noopener">
						<div className="w-full h-full lg:flex lg:justify-start lg:items-start border border-neutral-200 lg:flex-row-reverse">
							{/* Image Section */}
							<div className="lg:w-1/2 md:w-full lg:h-fit md:h-auto relative bg-white md:border-b lg:border-l border-neutral-200">
								{/* Example image link */}
								<img className="object-cover w-full h-full" src="/assets/blog/gambar/promo.png" alt="Image" />
							</div>

							{/* Content Section */}
							<div className="lg:w-1/2 md:w-full h-full p-8 bg-white border-neutral-200">
								<div className="text-neutral-500 text-xs font-light font-['Outfit'] uppercase leading-[18px] tracking-[4.80px]">PAPAN IKLAN</div>
								<div className="text-neutral-800 lg:text-3xl text-2xl font-medium font-['Outfit'] leading-9">Nak promote business korang di artikel Kawenlah?</div>
									<div className="w-fit mt-8 rounded-full px-8 py-4 bg-primary-500 cursor-pointer">
										<div className="text-center text-white text-base font-medium font-['Outfit'] leading-normal">Daftar Sekarang</div>
									</div>
							</div>
						</div>
					</Link>


					{allPosts.length > 0 && (
						<div className="bg-primary-100 grid grid-cols-4 px-10 py-10 border border-neutral-200 dark:bg-neutral-900 md:p-10">
							<div className="col-span-full md:col-span-2 md:col-start-2">
								<h2 className="text-primary-500 dark:text-primary-500 mb-10 font-['Outfit'] text-center text-lg font-semibold">
									Subscribe to our newsletter for updates and changelog.
								</h2>
								<SubscribeForm />
							</div>
						</div>
					)}

					{morePosts.length > 0 && (
						<>
							<MorePosts context="home" posts={morePosts} />
							{!loadedMore && pageInfo.hasNextPage && pageInfo.endCursor && (
								<div className="flex w-full flex-row items-center justify-center">
									<Button
										onClick={loadMore}
										type="outline"
										icon={<ChevronDownSVG className="h-5 w-5 stroke-current" />}
										label="Load more posts"
									/>
								</div>
							)}
							{loadedMore && pageInfo.hasNextPage && pageInfo.endCursor && (
								<Waypoint onEnter={loadMore} bottomOffset={'10%'} />
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
