import { Comment } from "@/payload-types";
import { CollectionAfterChangeHook } from "payload";

const AddSubscriberAfterComment: CollectionAfterChangeHook<Comment> = async ({
  doc,
  req,
}) => {
  const { payload } = req;
  if (doc.acceptsEmail) {
    const { docs: subscribers } = await payload.find({
      collection: "subscribers",
      where: { email: { equals: doc.author.email } },
    });
    if (!(subscribers?.length > 0)) {
      const newSubscriber = await payload.create({
        collection: "subscribers",
        data: doc.author,
      });
      console.log("A new subscriber was registered.");
    } else {
      console.log("The comment author is already subscribed.");
    }
  }
  return doc;
};
export default AddSubscriberAfterComment;
