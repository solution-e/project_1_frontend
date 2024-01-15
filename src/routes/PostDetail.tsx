import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPostDetail } from "./api";
import { IPostDetail } from "../types";
import { Box, Grid, HStack, Heading, Image, Text } from "@chakra-ui/react";

export default function PostDetail() {
  const { postPk } = useParams();
  const { data } = useQuery<IPostDetail>([`post`, postPk], getPostDetail,);
  return (
  <Box mt={10} px={{base:10, lg:40,}}>
    <Heading>{data?.title}</Heading>
    <Grid>
        <Text>pulltest</Text>
        {data?.photo.map((photo) => (
            <Box key={photo.pk}>
                <Image src={photo.photo_file} />
                {data?.content}
            </Box>
        ))}
    </Grid>
  </Box>
  )
}
