import Palette from "@/components/Palette";
import { fetchColors } from "./actions/colors";

export default async function Home() {
  const initialHexes = await fetchColors();

  return (
    <div className="flex flex-col items-center  h-screen">
      <header className="text-4xl font-bold my-30 select-none ">
        Color Palette Generator
      </header>
      <main className="flex justify-center flex-col items-center">
        <Palette initialHexes={initialHexes} />
      </main>
    </div>
  );
}
