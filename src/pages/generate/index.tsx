import Head from 'next/head';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import ExampleItemImg from '@public/example-item-img.png';
import getT from 'next-translate/getT';
import GeneratePlaylistStepper from '@components/generate/GeneratePlaylistStepper';
import { BandSearcherStub } from '@/components/generate/PlaylistSearchBandsForm/BandSearcher';

type GenerateTranslationProps = {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
};

const stubbedBands = [
  { id: 'Holding Absence', title: 'Holding Absence', icon: ExampleItemImg },
  { id: 'Hollywood Undead', title: 'Hollywood Undead', icon: ExampleItemImg },
  {
    id: 'Bring Me The Horizon',
    title: 'Bring Me The Horizon',
    icon: ExampleItemImg,
  },
  { id: 'Architects', title: 'Architects', icon: ExampleItemImg },
];

export type GenerateProps = {
  translations: GenerateTranslationProps;
  bandSearcher: BandSearcherStub;
};

export default function Generate({
  translations,
  bandSearcher = new BandSearcherStub(stubbedBands),
}: GenerateProps) {
  return (
    <>
      <Head>
        <title>{translations.meta.title}</title>
        <meta name="description" content={translations.meta.description} />
        <meta name="keywords" content={translations.meta.keywords} />
      </Head>
      <GeneratePlaylistStepper bandSearcher={bandSearcher} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { locale } = context;
  const t = await getT(locale || 'en', 'generate');

  const translations: GenerateTranslationProps = {
    meta: {
      title: t('meta.title'),
      description: t('meta.description'),
      keywords: t('meta.keywords'),
    },
  };

  return {
    props: {
      translations,
    },
  };
};
