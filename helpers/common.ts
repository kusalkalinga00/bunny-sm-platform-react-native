import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const heightPercentage = (percentage: number) => {
  return (height * percentage) / 100;
};

export const widthPercentage = (percentage: number) => {
  return (width * percentage) / 100;
};

export const stripHTMLTags = (htmlString: string): string => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};
