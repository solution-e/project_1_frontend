import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPostDetail, getPostReviews } from "../api";
import { IPostDetail, IReview } from "../types";
import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function PostDetail() {
  const { postPk } = useParams();
  const { data } = useQuery<IPostDetail>([`post`, postPk], getPostDetail);
  const { data: reviewsData } = useQuery<IReview[]>(
    [`post`, postPk, `reviews`],
    getPostReviews
  );
  return (
    <Box mt={10} px={{ base: 10, lg: 40 }}>
      <Heading>{data?.title}</Heading>
      <HStack>
        <Box mt={3}>
          <Text fontSize={"xl"}>
            作成者: 
            <Link to={`/OtherInfo/${data?.author?.id}`}>
            {data?.author?.name}
            </Link>
            </Text>
        </Box>
        {data?.is_author ? (
          <Button mt={4} size={"sm"}>
            修正
          </Button>
        ) : null}
        {data?.is_author ? (
          <Button mt={4} size={"sm"}>
            削除
          </Button>
        ) : null}
      </HStack>
      <Grid mt={8} h={"60vh"}>
        {data?.photo && data?.photo.length > 0
          ? data?.photo.map((photo) => (
              <Box key={photo.pk}>
                <Image src={photo.photo_file} />
              </Box>
            ))
          : null}
        <Box mt={8}>
          {data?.content && (
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          )}
        </Box>
        <HStack mt={8}>
          <Grid templateColumns={"1fr 1fr"}>
            {reviewsData?.map((review, index) => (
              <VStack key={index}>
                <HStack>
                  <Text>{review.user?.name}</Text>
                  <Text>{review.review_content}</Text>
                  <Text>{review.created_at}</Text>
                </HStack>
              </VStack>
            ))}
          </Grid>
        </HStack>
      </Grid>
    </Box>
  );
}
