import { objectType, extendType, nonNull, stringArg, intArg } from "nexus";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id");
    t.string("title");
    t.string("body");
    t.boolean("published");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("drafts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.posts.filter((p) => !p.published);
      },
    });
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.posts.filter((p) => p.published);
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const draft = {
          id: ctx.db.posts.length + 1,
          title: args.title,
          body: args.body,
          published: false,
        };

        ctx.db.posts.push(draft);

        return draft;
      },
    });
    t.field("publish", {
      type: "Post",
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        let draftsToPublish = ctx.db.posts.find((p) => p.id === args.draftId);

        if (!draftsToPublish) {
          throw new Error(`Could not find draft with id: ${args.draftId}`);
        }

        draftsToPublish.published = true;

        return draftsToPublish;
      },
    });
  },
});
