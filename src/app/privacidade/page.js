import Link from "next/link";

import EscolhaDeMedicao from "@/components/EscolhaDeMedicao";
import { Logo } from "@/components/art";

export const metadata = {
  title: "Privacidade — Homem-Aranha: Um Novo Dia",
  description:
    "O que este site guarda, o que ele mede e o que você pode desligar. Sem cookies, sem conta, sem formulário.",
};

/**
 * A página de privacidade.
 *
 * ⚠️ TUDO AQUI PRECISA SER VERIFICÁVEL NO CÓDIGO. Política de privacidade é o
 * lugar mais fácil do site para escrever bonito e errado — e cada frase aqui
 * foi conferida:
 *
 *  · sem cookies: `grep` por `document.cookie` no projeto não devolve nada, e a
 *    medição da Vercel é anunciada por eles como sem cookies;
 *  · fontes não chamam o Google: `next/font/google` baixa em tempo de BUILD e
 *    serve do próprio domínio (os arquivos estão em `.next/static/media`);
 *  · não há terceiro nenhum embutido: nenhuma URL externa no `src/`;
 *  · o `localStorage` tem exatamente duas chaves, as duas listadas abaixo.
 *
 * Se alguma dessas coisas mudar, esta página vira mentira. Ao acrescentar
 * qualquer script, fonte, mapa, vídeo incorporado ou ferramenta de terceiro,
 * voltar aqui é parte do trabalho, não um extra.
 */

function Secao({ titulo, children }) {
  return (
    <section className="mt-12">
      <h2 className="display text-[clamp(1.4rem,3vw,1.9rem)] text-bone">{titulo}</h2>
      <div className="mt-4 space-y-4 font-mono text-[0.82rem] leading-relaxed text-bone-dim/75 sm:text-[0.875rem]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-void pb-32">
      <header className="flex items-center justify-between px-6 py-7 lg:px-10">
        <Link href="/" aria-label="Um Novo Dia — início" className="text-bone">
          <Logo />
        </Link>
        <Link
          href="/"
          className="eyebrow shrink-0 whitespace-nowrap rounded-full border border-bone/25 px-4 py-3 text-bone-dim transition-colors hover:border-bone/60 hover:text-bone sm:px-5"
        >
          ← Voltar<span className="hidden sm:inline"> ao início</span>
        </Link>
      </header>

      <div className="mx-auto max-w-[46rem] px-6 pt-10 lg:px-10 lg:pt-16">
        <p className="eyebrow text-blood-400">Privacidade</p>
        <h1 className="display mt-4 text-[clamp(2.2rem,6vw,4rem)] text-bone">
          O que este site guarda
        </h1>
        <p className="mt-7 font-mono text-[0.875rem] leading-relaxed text-bone-dim/75">
          Resposta curta: quase nada, e nada que identifique você. A resposta longa está abaixo.
        </p>

        <Secao titulo="Sem conta, sem formulário">
          <p>
            Este site é uma peça de portfólio. Não tem cadastro, login, comentário, newsletter nem
            campo nenhum para preencher. Não existe um lugar onde você possa digitar seu nome ou seu
            e-mail, então não há o que ser coletado por aí.
          </p>
        </Secao>

        <Secao titulo="Sem cookies">
          <p>
            Nenhum cookie é gravado — nem do site, nem de terceiros. Não há publicidade, botão de
            rede social, mapa incorporado, vídeo do YouTube nem qualquer outro conteúdo carregado de
            fora. As fontes tipográficas vêm do próprio domínio: elas são baixadas na hora de gerar
            o site e servidas junto com ele, então seu navegador não pede nada ao Google.
          </p>
        </Secao>

        <Secao titulo="O que fica guardado no seu aparelho">
          <p>
            Duas informações, no armazenamento local do navegador. Elas <strong>não saem do seu
            aparelho</strong> — ninguém as recebe, nem eu:
          </p>
          <ul className="space-y-3 pl-5">
            <li className="list-disc">
              <span className="text-bone">aviso-entrada</span> — lembra que você já leu o aviso de
              abertura, para ele não aparecer toda vez.
            </li>
            <li className="list-disc">
              <span className="text-bone">consentimento-analise</span> — guarda a sua resposta sobre
              a medição de audiência.
            </li>
          </ul>
          <p>
            Limpar os dados do site no seu navegador apaga as duas, e o aviso volta a aparecer.
          </p>
        </Secao>

        <Secao titulo="Medição de audiência, e só se você deixar">
          <p>
            O site é hospedado na Vercel, que oferece uma medição de audiência sem cookies e sem
            perfil de pessoa: ela conta páginas vistas e reúne coisas como país de origem, tipo de
            aparelho e navegador, em números agregados. Serve para saber se alguém apareceu, não
            para saber quem.
          </p>
          <p>
            <strong className="text-bone">Ela fica desligada até você deixar.</strong> Enquanto não
            houver um &ldquo;pode medir&rdquo; guardado no seu navegador, o componente de medição
            não é carregado e nenhuma requisição sai daqui. Recusar não muda nada no site — tudo
            continua funcionando igual.
          </p>
          <EscolhaDeMedicao />
        </Secao>

        <Secao titulo="Registros do servidor">
          <p>
            Como qualquer site, o servidor que entrega estas páginas registra as requisições que
            chegam — endereço de IP, horário e a página pedida. É o funcionamento básico da
            hospedagem, existe antes de qualquer escolha sua e serve para manter o serviço no ar e
            protegido contra abuso. Esses registros são da Vercel; a política deles vale para essa
            parte.
          </p>
        </Secao>

        <Secao titulo="Seus direitos">
          <p>
            Pela LGPD você pode pedir confirmação, acesso, correção ou eliminação de dados pessoais
            tratados por quem opera um site. Aqui a lista é curta porque quase não há tratamento: o
            que existe está descrito acima, e a parte que depende de escolha você desliga no botão
            desta página.
          </p>
          <p>
            Para falar sobre isto, o caminho é uma issue no{" "}
            <a
              href="https://github.com/Vinicius-Santos234/homem-aranha-um-novo-dia"
              className="text-bone underline decoration-bone/30 underline-offset-4 transition-colors hover:decoration-bone"
              target="_blank"
              rel="noreferrer"
            >
              repositório do projeto
            </a>
            .
          </p>
        </Secao>

        <Secao titulo="Sobre o conteúdo">
          <p>
            Este não é um site oficial. O Homem-Aranha, os demais personagens e todo o material
            visual pertencem à Marvel, à Sony Pictures e aos seus respectivos detentores de
            direitos, e estão aqui sem fim comercial. Os textos foram gerados por IA a partir do
            enredo do filme e podem divergir da trama.
          </p>
        </Secao>

        <p className="mt-14 font-mono text-[0.72rem] text-bone-dim/45">
          Última revisão: 25 de agosto de 2026.
        </p>
      </div>
    </main>
  );
}
