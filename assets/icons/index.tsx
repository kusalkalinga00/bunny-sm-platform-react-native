import React from "react";
import { theme } from "../../constants/theme";
import ArrowLeft from "./ArrowLeft";
import Call from "./Call";
import Camera from "./Camera";
import Comment from "./Comment";
import Delete from "./Delete";
import Edit from "./Edit";
import Heart from "./Heart";
import Home from "./Home";
import Image from "./Image";
import Location from "./Location";
import Lock from "./Lock";
import Logout from "./logout";
import Mail from "./Mail";
import Plus from "./Plus";
import Search from "./Search";
import Send from "./Send";
import Share from "./Share";
import ThreeDotsCircle from "./ThreeDotsCircle";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";
import User from "./User";
import Video from "./Video";

const icons = {
  home: Home,
  mail: Mail,
  lock: Lock,
  user: User,
  heart: Heart,
  plus: Plus,
  search: Search,
  location: Location,
  call: Call,
  camera: Camera,
  edit: Edit,
  arrowLeft: ArrowLeft,
  threeDotsCircle: ThreeDotsCircle,
  threeDotsHorizontal: ThreeDotsHorizontal,
  comment: Comment,
  share: Share,
  send: Send,
  delete: Delete,
  logout: Logout,
  image: Image,
  video: Video,
};

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
  [key: string]: any;
}

const Icon: React.FC<IconProps> = ({
  name,
  size,
  strokeWidth,
  color,
  ...rest
}) => {
  const IconComponent = icons[name];

  // Runtime guard (shouldn't trigger with typed `name`, but keeps UI safe)
  if (!IconComponent) return null;

  const resolvedSize = size ?? 24;
  const resolvedStroke = strokeWidth ?? 1.9;
  const resolvedColor = color ?? theme.colors.textLight;

  return (
    <IconComponent
      height={resolvedSize}
      width={resolvedSize}
      strokeWidth={resolvedStroke}
      color={resolvedColor}
      {...rest}
    />
  );
};

export default Icon;
