import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "..";
const PostsList = observer(() => {
  const { postStore } = useContext(RootStoreContext);

  return (
    <div style={{ color: "white", flex: "1", marginLeft: "310px" }}>
      {postStore.userPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
});

export default PostsList;
