import { Base64 } from "js-base64";

const stripEmojis = (str: string) =>
  str
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

export const getAutogeneratedPostOG = (post: any) => {
  const {
    title,
    readTimeInMinutes,
    reactionCount = 0,
    responseCount = 0,
    author,
  } = post;

  const ogUrl = `https://${process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST}/api/og/post`;
  const ogData: any = {};

  try {
    ogData.title = encodeURIComponent(stripEmojis(title));
    ogData.author = encodeURIComponent(author!.name);
    ogData.domain = new URL(ogUrl).hostname;

    if (author!.profilePicture) {
      ogData.photo = author!.profilePicture;
    }

    if (readTimeInMinutes) {
      ogData.readTime = readTimeInMinutes;
    }

    if (reactionCount > 0) {
      ogData.reactions = reactionCount;
    }

    if (responseCount > 0) {
      ogData.comments = responseCount;
    }
  } catch (e) {
    console.log(e);
  }
  return `${ogUrl}?og=${Base64.encode(JSON.stringify(ogData))}`;
};

export const getAutogeneratedPublicationOG = (publication: any) => {
  const { title, isTeam, favicon, author, followersCount, descriptionSEO } =
    publication;
  const totalDocuments = publication.posts!.totalDocuments;
  const logo = publication.preferences.logo;

  const ogUrl = `${publication.url}/api/og/home`;
  const ogData: Record<string, any> = {};

  try {
    ogData.title = title
      ? encodeURIComponent(stripEmojis(title))
      : `${author!.name}'s ${isTeam ? "team" : ""} blog`;
    ogData.domain = new URL(publication.url).hostname;
    ogData.followers = isTeam ? followersCount : author!.followersCount;

    if (author!.profilePicture && !isTeam) {
      ogData.photo = author!.profilePicture;
    }

    if (logo) {
      ogData.logo = logo;
    }

    if (isTeam) {
      ogData.isTeam = isTeam;
    }

    if (descriptionSEO) {
      ogData.meta = encodeURIComponent(stripEmojis(descriptionSEO)); // Vercel OG is not able to work with all kinds of emojis
    }

    if (favicon) {
      ogData.favicon = favicon;
    }

    if (totalDocuments && totalDocuments > 0) {
      ogData.articles = totalDocuments;
    }
  } catch (e) {
    console.log(e);
  }
  return `${ogUrl}?og=${Base64.encode(JSON.stringify(ogData))}`;
};
