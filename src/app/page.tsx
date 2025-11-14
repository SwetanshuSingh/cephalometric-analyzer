"use client";

import CephCanvas from "@/components/ceph-canvas";
import { ImageUploader } from "@/components/image-uploader";
import { Landmark } from "@/types/landmarks";
import { AngularMeasurement, LinearMeasurement } from "@/types/measurements";
import { useState } from "react";

type CephState = {
  uploadedImage: string | null;
  imageScale: number;
  landmarks: Record<string, Landmark>;
  activeLandmark: string | null;
  linearMeasurements: LinearMeasurement[];
  angularMeasurements: AngularMeasurement[];
};

const Home = () => {
  const [state, setState] = useState<CephState | undefined>(undefined);

  const setImage = (image: string) => {
    setState({
      uploadedImage: image,
      imageScale: 1,
      activeLandmark: null,
      landmarks: {},
      linearMeasurements: [],
      angularMeasurements: [],
    });
  };

  return (
    <main className="w-full h-screen flex bg-black text-white">
      <ImageUploader setImage={setImage} />
      <CephCanvas state={state} setState={setState} />
    </main>
  );
};

export default Home;
