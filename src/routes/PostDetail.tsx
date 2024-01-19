import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPostDetail, getPostReviews } from "../api";
import { IPostDetail, IReview } from "../types";
import {
  Box,
  Grid,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

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
      <Box mt={3}>
        <Text fontSize={"xl"}>作成者: {data?.author.name}</Text>
      </Box>
      <Grid mt={8} h={"60vh"}>
        {data?.photo.map((photo) => (
          <Box key={photo.pk}>
            <Image src={photo.photo_file} />
            {data?.content}
          </Box>
        ))}
        <HStack mt={8}>
          <Grid templateColumns={"1fr 1fr"}>
            {reviewsData?.map((review, index) => (
              <VStack key={index}>
                <HStack>
                  <Text>{review.user.name}</Text>
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
