import { getFormattedDate } from '@/lib/utils';
import Link from 'next/link';
import PostCard from './post-card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export default function PostList({ host, posts, loadNextPost, loading, hasNextPage }: any) {
	const latestPost = posts.slice(0, 5);
	const restPosts = posts.slice(5);
	return (
		<>
			<div className="mt-10 grid grid-cols-1 gap-6 px-3 lg:grid-cols-3">
				{latestPost.map(
					(post: any, i: number) =>
						i < 5 && (
							<div
								key={i}
								className={`group relative overflow-hidden rounded-xl border  border-neutral-800  bg-neutral-900 hover:cursor-pointer hover:border-blue-300
                    ${i === 0 && 'row-start-1 md:row-span-2 '}
                    ${i === 1 && 'h-64 lg:h-[280px] '}
                    ${i === 2 && 'h-64 lg:h-80 '}
                    ${i === 3 && 'h-64 lg:-mt-9 lg:h-[330px] '}
                    ${i === 4 && 'h-72'}
                    `}
							>
								<Link href={`/${post.node.slug}`}>
									<img
										className="h-full w-full object-cover"
										src={post.node.coverImage.url}
										alt=""
									/>
									<div className="absolute bottom-0 flex w-full flex-col justify-start rounded-b-[24px] bg-[rgba(0,0,0,0.5)] p-8 lg:p-0 xl:p-8">
										<p className="font-InterBold absolute bottom-14 z-20 mb-5 ml-2 text-xl text-neutral-50 group-hover:hidden">
											{post.node.title}
										</p>

										<div className="absolute bottom-3 z-20 flex w-full items-center justify-between px-2 text-sm font-bold text-neutral-500 group-hover:hidden">
											<div className="mt-24 flex items-center gap-x-2">
												<Avatar className="h-6 w-6">
													{' '}
													<AvatarImage src={post.node.author.profilePicture} />
													<AvatarFallback>SC</AvatarFallback>
												</Avatar>

												<p className="text-xs md:text-base">{post.node.author.name}</p>
												<br />
												<p className="p-4 text-xs text-gray-500 md:text-base">
													Posted on {getFormattedDate(post.node.publishedAt)}
												</p>
											</div>
										</div>
										<div className="dark:text-primary hidden bg-zinc-900/20 text-white group-hover:block">
											<p className="">{post.node.brief}</p>
										</div>
									</div>
								</Link>
								<div className=" absolute  bottom-0 z-10 h-44  w-full bg-gradient-to-t  from-[#000000] via-black/80   to-transparent transition-all duration-200 ease-in" />
							</div>
						),
				)}
			</div>
			<h1 className="ml-2 mt-16 text-4xl font-semibold ">Other Post</h1>
			{restPosts.length > 0 && (
				<div className="px-8 pb-16 pt-8">
					<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 ">
						{restPosts.map((post: any) => (
							<PostCard key={post?.node?.slug} host={host} post={post?.node} />
						))}
					</div>

					<div className="flex w-full justify-center">
						<Button
							disabled={loading || !hasNextPage}
							className="mt-10"
							variant="ghost"
							onClick={loadNextPost}
						>
							{!hasNextPage ? 'The End' : loading ? 'Loading More..' : `Show More Posts`}
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
