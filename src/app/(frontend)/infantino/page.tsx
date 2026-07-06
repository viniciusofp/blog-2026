import TravelsMap from "@/components/doodles/infantino/TravelsMap";

export type InfantinoProps = {};

export type StadiumType = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
};

export default async function Infantino(props: InfantinoProps) {
  return <TravelsMap />;
}
