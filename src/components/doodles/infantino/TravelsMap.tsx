"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  Source,
  StyleSpecification,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import mapStyle from "@/lib/mapStyle.json";
import { StadiumType } from "@/app/(frontend)/infantino/page";
import Pin from "./Pin";
import { getAttendances, getStadiums } from "./data";

export type TravelsMapProps = {};

const SPEED = 4; // segments per second

export default function TravelsMap({}: TravelsMapProps) {
  const [stadiums, setStadiums] = useState<StadiumType[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const animationFrame = useRef<number>(null);
  const previousTime = useRef<number>(null);

  useEffect(() => {
    async function load() {
      const stadiumsData = await getStadiums();
      const attendancesData = await getAttendances();

      setStadiums(stadiumsData);

      const coords: [number, number][] = attendancesData.map((attendance) => {
        const stadium = stadiumsData.find(
          (s) => s.id === attendance.stadium_id,
        ) ?? {
          longitude: 0,
          latitude: 0,
        };

        return [stadium.longitude, stadium.latitude];
      });

      setCoordinates(coords);
    }

    load();
  }, []);

  useEffect(() => {
    if (!isPlaying || coordinates.length < 2) return;

    const animate = (time: number) => {
      if (previousTime.current == null) {
        previousTime.current = time;
      }

      const delta = (time - previousTime.current) / 1000;
      previousTime.current = time;

      setProgress((current) => {
        const next = current + delta * SPEED;

        if (next >= coordinates.length - 1) {
          setIsPlaying(false);
          return coordinates.length - 1;
        }

        return next;
      });
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      //@ts-ignore
      previousTime.current = undefined;
    };
  }, [isPlaying, coordinates]);

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  const animatedCoordinates = useMemo(() => {
    console.log(progress);
    if (coordinates.length === 0) return [];

    const segment = Math.floor(progress);

    if (segment >= coordinates.length - 1) {
      return coordinates;
    }

    const t = progress - segment;

    const from = coordinates[segment];
    const to = coordinates[segment + 1];

    const interpolated: [number, number] = [
      lerp(from[0], to[0], t),
      lerp(from[1], to[1], t),
    ];

    return [...coordinates.slice(0, segment + 1), interpolated];
  }, [coordinates, progress]);

  const animatedGeoJSON = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: animatedCoordinates,
          },
        },
      ],
    }),
    [animatedCoordinates],
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,
          display: "flex",
          gap: 8,
        }}
      >
        <button onClick={() => setIsPlaying(true)}>Play</button>

        <button onClick={() => setIsPlaying(false)}>Pause</button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setProgress(0);
          }}
        >
          Reset
        </button>
      </div>

      <Map
        initialViewState={{
          longitude: -99.1,
          latitude: 32.2,
          zoom: 2.2,
        }}
        style={{ width: "100%", height: "80svh" }}
        mapStyle={mapStyle as StyleSpecification}
      >
        {coordinates.length > 1 && (
          <Source id="trace" type="geojson" data={animatedGeoJSON}>
            <Layer
              id="trace-layer"
              type="line"
              paint={{
                "line-color": "#222",
                "line-opacity": 0.4,
                "line-width": 3,
              }}
            />
          </Source>
        )}

        {stadiums.map((stadium) => (
          <Marker
            key={stadium.id}
            latitude={stadium.latitude}
            longitude={stadium.longitude}
            anchor="center"
          >
            <Pin />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
