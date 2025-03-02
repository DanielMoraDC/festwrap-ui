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

const getEmptyMessage = (
  loading: boolean,
  playlists: any[],
  searchValue: string
) => {
  if (loading) {
    return 'Loading...';
  }

  if (playlists.length === 0 && searchValue.trim() !== '') {
    return 'No playlists found';
  }

  return 'Search for a playlist';
};

const ExistingPlaylistsSelector = () => {
  const { t } = useTranslation('generate');
  const [searchValue, setSearchValue] = useState('');
  const { playlists, search, loading } = useExistingPlaylists();

  const { control } = useFormContext();

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    search(searchTerm);
    setSearchValue(searchTerm);
  }, 500);

  const playlistItems = playlists?.map((playlist) => ({
    value: playlist.name,
    label: playlist.name,
  }));

  const emptyMessage = getEmptyMessage(loading, playlists, searchValue);

  return (
    <FormField
      control={control}
      name="playlistSelected"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('steps.step1.form.useExistingPlaylist.selectPlaylist')}
          </FormLabel>
          <SelectSearch
            items={playlistItems}
            value={field.value}
            onChange={field.onChange}
            onSearch={debouncedSearch}
          >
            <SelectSearchRoot>
              <SelectSearchTrigger />
              <SelectSearchContent emptyMessage={emptyMessage} />
            </SelectSearchRoot>
          </SelectSearch>
        </FormItem>
      )}
    />
  );
};

export default ExistingPlaylistsSelector;
