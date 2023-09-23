import React from 'react'
import Navb from '../components/Navb'
import { RootStoreContext } from '..';
import { useContext } from 'react';
const Post = () => {
    const { id } = useParams();
    const {postStore} = useContext(RootStoreContext)
    const author = userStore.users.find(
       ???  
      );
    return (
    <div>
      <Navb/>
      <Card
            style={{
              color: "white",
              backgroundColor: "#3f4653",
              height: "550px",
              width: "80%",
              marginLeft: "10px",
              marginTop: "10px",
            }}
          >
            {author && (
              <Card.Header style={{ display: "flex" }}>
                <Col xs={2} md={1} style={{ width: "auto" }}>
                  <Image
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                    src={author.avatar}
                    roundedCircle
                  />
                </Col>
                <div>
                  {author.first_name} {author.last_name}
                </div>
              </Card.Header>
            )}

            <Card.Img
              variant="top"
              style={{ width: "44%", marginTop: "10px", marginLeft: "25%" }}
              src="http://localhost:8000/images/night.jpg"
            />
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Text>{post.content}</Card.Text>
              <Button variant="outline-light">Подробнее...</Button>
            </Card.Body>
          </Card>
    </div>
  )
}

export default Post
