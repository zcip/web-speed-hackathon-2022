import styled from "styled-components";

export const Img = styled.img`
  object-fit: cover;
  object-position: center center;
  max-width: 100%;
  height: auto;
`

export const ImageW16H9 = styled(Img)`
  aspect-ratio: 16 / 9;
`

export const ImageW1H1 = styled(Img)`
  aspect-ratio: 1 / 1;
`