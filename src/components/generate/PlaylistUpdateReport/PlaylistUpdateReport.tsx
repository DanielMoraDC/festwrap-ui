import { Button } from '@components/ui/Button';
import Heading from '@components/ui/Heading';
import { Input } from '@components/ui/Input';
import useTranslation from 'next-translate/useTranslation';
import playlistReadyImage from '@public/playlist-ready.svg';
import Image from 'next/image';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const URL_BASE = 'https://open.spotify.com/playlist/';

const PlaylistUpdateReport = ({
  playlistId,
}: {
  playlistId: string | undefined;
}) => {
  const { t } = useTranslation('generate');
  const { copy, isCopied } = useCopyToClipboard();
  const urlWithId = `${URL_BASE}${playlistId}`;
  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t('steps.step3.title')}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t('steps.step3.description')}
        </p>
      </div>
      <div className="flex flex-col space-y-6 items-center">
        <div className="flex flex-col space-y-2">
          <Image
            src={playlistReadyImage}
            alt="Playlist ready"
            className="w-48 h-full"
          />
          <div className="text-dark-blue font-medium">
            {t('steps.step3.playlisyGeneratedSuccessfully')}
          </div>
        </div>
        <div className="flex w-full md:w-3/4 space-x-2 mt-6">
          <Input value={urlWithId} readOnly />
          <Button
            type="button"
            variant="outline"
            onClick={() => copy(urlWithId)}
          >
            {isCopied
              ? t('steps.step3.copySuccessButton')
              : t('steps.step3.copyButton')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PlaylistUpdateReport;
