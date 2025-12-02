"use client";

import React, { useEffect, useRef } from "react";
import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Text from "ol/style/Text";

export type RoutePoint = {
  id: number | string;
  lat: number;
  lng: number;
  /** Texto encima del punto (ej: placa) */
  label?: string;
  /** Estado para colorear el punto */
  status?: "en_servicio" | "detenido" | "sin_senal";
};

type RoutesMapProps = {
  points: RoutePoint[];
  onMapClick?: (coords: { lon: number; lat: number }) => void;
};

const RoutesMap: React.FC<RoutesMapProps> = ({ points, onMapClick }) => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  // refs sin valor inicial, los rellenamos en el efecto
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const vectorLayerRef = useRef<VectorLayer | null>(null);

  // handler de click guardado en ref
  const clickHandlerRef = useRef<RoutesMapProps["onMapClick"] | null>(null);
  useEffect(() => {
    clickHandlerRef.current = onMapClick ?? null;
  }, [onMapClick]);

  // Inicializar mapa una sola vez
  useEffect(() => {
    if (!mapElementRef.current) return;

    // Crear source y layer una vez
    if (!vectorSourceRef.current) {
      vectorSourceRef.current = new VectorSource();
    }
    if (!vectorLayerRef.current) {
      vectorLayerRef.current = new VectorLayer({
        source: vectorSourceRef.current,
      });
    }

    const map = new Map({
      target: mapElementRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayerRef.current,
      ],
      view: new View({
        center: fromLonLat([-77.0428, -12.0464]), // Lima aprox
        zoom: 11,
      }),
    });

    map.on("click", (evt) => {
      const handler = clickHandlerRef.current;
      if (!handler) return;
      const [lon, lat] = toLonLat(evt.coordinate);
      handler({ lon, lat });
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Redibujar puntos cuando cambian
  useEffect(() => {
    const source = vectorSourceRef.current;
    if (!source) return;

    source.clear();

    points.forEach((p) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([p.lng, p.lat])),
      });

      // Colores según estado
      let fillColor = "#22c55e"; // en servicio
      let strokeColor = "#0f172a";

      if (p.status === "detenido") {
        fillColor = "#f97316"; // naranja
        strokeColor = "#ea580c";
      } else if (p.status === "sin_senal") {
        fillColor = "#6b7280"; // gris
        strokeColor = "#374151";
      }

      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: strokeColor, width: 2 }),
          }),
          text: p.label
            ? new Text({
                text: String(p.label),
                offsetY: -18,
                font: "11px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fill: new Fill({ color: "#e5e7eb" }),
                stroke: new Stroke({
                  color: "rgba(15,23,42,0.85)",
                  width: 3,
                }),
              })
            : undefined,
        })
      );

      source.addFeature(feature);
    });
  }, [points]);

  return (
    <div
      ref={mapElementRef}
      className="h-full w-full rounded-2xl border border-slate-800"
    />
  );
};

export default RoutesMap;
