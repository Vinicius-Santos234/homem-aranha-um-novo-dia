import { Anton, Poppins } from "next/font/google";
import AvisoEntrada from "@/components/AvisoEntrada";
import Consentimento from "@/components/Consentimento";
import VoltarAoTopo from "@/components/VoltarAoTopo";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Homem-Aranha: Um Novo Dia",
  description:
    "Quatro anos depois de o mundo esquecer quem ele é, Peter Parker divide Nova York com um telepata, um justiceiro e um poder que está mudando dentro dele.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${anton.variable}`}>
      <body>
        {children}
        <VoltarAoTopo />
        {/* No layout e não na página: quem cai direto em `/lugares` por um
            link compartilhado precisa ver o aviso igual a quem entra pela
            home. */}
        <AvisoEntrada />
        {/* ⚠️ O `<Analytics />` NÃO MORA MAIS AQUI. Ele é montado dentro do
            `Consentimento`, e só com "aceito" gravado — montado no layout, a
            faixa de consentimento perguntaria e a medição rodaria do mesmo
            jeito. Ao mexer nisto, ler o cabeçalho de `lib/consentimento.js`. */}
        <Consentimento />
      </body>
    </html>
  );
}
