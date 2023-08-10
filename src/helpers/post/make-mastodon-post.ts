import {mastodon} from 'masto';
import {Tweet} from '@the-convocation/twitter-scraper';
import { Platform} from '../../types/index.js';
import {MastodonPost} from '../../types/post.js';
import {MASTODON_INSTANCE} from '../../constants.js';
import {getCache} from '../cache/index.js';

export const makeMastodonPost= async (client: mastodon.rest.Client, tweet: Tweet) : Promise<MastodonPost> => {
    const cache = await getCache();

    const username = await client.v1.accounts.verifyCredentials().then(account => account.username);

    const status = tweet.quotedStatusId ? `${tweet.text}\n\nhttps://${MASTODON_INSTANCE}/@${username}/${cache[tweet.quotedStatusId]?.[Platform.MASTODON]}` : tweet.text!;
    const inReplyToId = (tweet.isSelfThread && tweet.inReplyToStatusId) ? cache[tweet.inReplyToStatusId]?.[Platform.MASTODON] : undefined;

    return {
        username,
        status,
        inReplyToId,
        tweet
    };
};