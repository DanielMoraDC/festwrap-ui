import Heading from '@components/ui/Heading';
import { X } from 'lucide-react';
import { SearchBandsCombobox } from './SearchBandsCombobox';
import ExampleItemImg from '@public/example-item-img.png';
import EmptyListImg from '@public/empty-list.png';
import Image from 'next/image';
import { Badge } from '@components/ui/Badge';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/Form';
import ErrorMessage from '@/components/ui/ErrorMessage';

// Mock data for artists
const options = [
  {
    id: 1,
    title: 'Holding Absence',
    icon: ExampleItemImg,
  },
  {
    id: 2,
    title: 'Hollywood Undead',
    icon: ExampleItemImg,
  },
  {
    id: 3,
    title: 'Bring Me The Horizon',
    icon: ExampleItemImg,
  },
  {
    id: 4,
    title: 'Architects',
    icon: ExampleItemImg,
  },
];

const PlaylistSearchBandsForm = () => {
  const { control, watch, setValue, formState } = useFormContext();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  const selectedValues: Array<number> = watch('bands', []);

  const removeSelectedItem = (id: number) => {
    const newSelectedItems = selectedValues.filter((item) => item !== id);
    setValue('bands', newSelectedItems);
  };

  const selectedItems = options.filter((option) =>
    selectedValues.includes(option.id)
  );

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
        <FormField
          control={control}
          name="bands"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SearchBandsCombobox
                  options={options}
                  values={field.value}
                  onChange={field.onChange}
                  placeholder={t('steps.step2.searchPlaceholder')}
                />
              </FormControl>
              {errors.bands && (
                <ErrorMessage>
                  {t('steps.errors.selectedBands.required')}
                </ErrorMessage>
              )}
            </FormItem>
          )}
        />
        {selectedValues.length === 0 ? (
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
            {selectedItems.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                size="lg"
                className="flex items-center gap-1 px-3 py-1"
              >
                {item.title}
                <button
                  onClick={() => removeSelectedItem(item.id)}
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
