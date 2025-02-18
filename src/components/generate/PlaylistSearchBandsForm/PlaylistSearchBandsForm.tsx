import Heading from '@components/ui/Heading';
import { X } from 'lucide-react';
import { SearchBandsCombobox } from './SearchBandsCombobox';
import EmptyListImg from '@public/empty-list.png';
import Image from 'next/image';
import { Badge } from '@components/ui/Badge';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { BandSearcher, SearchedBand } from './BandSearcher';

const PlaylistSearchBandsForm = ({
  bandSearcher,
}: {
  bandSearcher: BandSearcher;
}) => {
  const { t } = useTranslation('generate');
  const [selectedBands, setSelectedBands] = useState<SearchedBand[]>([]);

  const removeSelectedItem = (bandToRemove: SearchedBand) => {
    const newSelection = selectedBands.filter(
      (band) => band.id !== bandToRemove.id
    );
    setSelectedBands(newSelection);
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t('steps.step2.title')}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t('steps.step2.description')}
        </p>
      </div>
      <div className="w-full">
        <SearchBandsCombobox
          bandSearcher={bandSearcher}
          onSelectionChange={setSelectedBands}
          searchPlaceholder={t('steps.step2.searchPlaceholder')}
        />
        {selectedBands.length === 0 ? (
          <div className="mt-8 text-center text-dark-blue">
            <div className="flex justify-center mb-4">
              <Image
                src={EmptyListImg}
                alt="No artists selected"
                className="w-48 h-full"
              />
            </div>
            <h3 className="font-semibold mb-2">
              {t('steps.step2.emptyState.title')}
            </h3>
            <p className="text-sm">{t('steps.step2.emptyState.description')}</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedBands.map((band) => (
              <Badge
                key={band.id}
                variant="secondary"
                size="lg"
                className="flex items-center gap-1 px-3 py-1"
              >
                {band.title}
                <button
                  onClick={() => removeSelectedItem(band)}
                  className="ml-1 hover:bg-slate-100 rounded-full hover:text-primary text-dark-blue"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PlaylistSearchBandsForm;
