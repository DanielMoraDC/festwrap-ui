import { FormField, FormLabel, FormItem } from '@/components/ui/Form';
import {
  SelectSearch,
  SelectSearchRoot,
  SelectSearchTrigger,
  SelectSearchContent,
} from '@/components/ui/SelectSearch';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { useExistingPlaylists } from './useExistingPlaylists';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/ErrorMessage';

const getEmptyMessageKeyTranslation = (
  loading: boolean,
  playlists: any[],
  searchValue: string
) => {
  if (loading) {
    return 'steps.step1.form.useExistingPlaylist.playlistSelector.loading';
  }

  if (playlists.length === 0 && searchValue.trim() !== '') {
    return 'steps.step1.form.useExistingPlaylist.playlistSelector.noResults';
  }

  return 'steps.step1.form.useExistingPlaylist.playlistSelector.searchPlaceholder';
};

const ExistingPlaylistsSelector = () => {
  const { t } = useTranslation('generate');
  const [searchValue, setSearchValue] = useState('');
  const { playlists, search, loading } = useExistingPlaylists();

  const { control, formState } = useFormContext();
  const { errors } = formState;

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    search(searchTerm);
    setSearchValue(searchTerm);
  }, 500);

  const playlistItems = playlists?.map((playlist) => ({
    value: playlist.name,
    label: playlist.name,
  }));

  const emptyMessageKeyTranslation = getEmptyMessageKeyTranslation(
    loading,
    playlists,
    searchValue
  );

  return (
    <FormField
      control={control}
      name="playlistSelected"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('steps.step1.form.useExistingPlaylist.playlistSelector.title')}
          </FormLabel>
          <SelectSearch
            items={playlistItems}
            value={field.value}
            onChange={field.onChange}
            onSearch={debouncedSearch}
          >
            <SelectSearchRoot>
              <SelectSearchTrigger
                placeholder={t(
                  'steps.step1.form.useExistingPlaylist.playlistSelector.placeholder'
                )}
              />
              <SelectSearchContent
                emptyMessage={t(emptyMessageKeyTranslation)}
              />
            </SelectSearchRoot>
          </SelectSearch>
          {errors.playlistSelected?.message && (
            <ErrorMessage>
              {t('steps.errors.playlistSelected.required')}
            </ErrorMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default ExistingPlaylistsSelector;
