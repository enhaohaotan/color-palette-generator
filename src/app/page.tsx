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
      <footer>
        <p className="font-light text-neutral-500 select-none text-sm">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://tanenhao.com"
            className="underline hover:text-neutral-400"
            target="_blank"
          >
            Enhao Tan
          </a>
          . Color generation powered by{" "}
          <a
            href="http://colormind.io/api-access/"
            className="underline hover:text-neutral-400"
            target="_blank"
          >
            Colormind API.
          </a>
        </p>
      </footer>
    </div>
  );
}
