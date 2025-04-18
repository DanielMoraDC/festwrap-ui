import { describe, expect, vi, it, beforeEach } from 'vitest';
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneratePlaylistPage, { GenerateProps } from '@/pages/generate';
import { ReactNode } from 'react';
import { ServiceProvider } from '@/contexts/ServiceContext';
import { toast } from 'sonner';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const staticTranslations: GenerateProps = {
  translations: {
    meta: {
      title: 'Generate a playlist',
      description: 'Generate a playlist description',
      keywords: 'Generate a playlist keywords',
    },
  },
};

userEvent.setup();

beforeEach(() => {
  vi.resetAllMocks();
  cleanup();
});

const clickToNextButton = async () => {
  const nextButton = screen.getByRole('button', {
    name: /steps.navigation.next/i,
  });
  await userEvent.click(nextButton);
};

const waitForSecondStepContent = async () => {
  const secondStepContentTitle = await waitFor(() => {
    const secondStepContent = screen.getByRole('tabpanel');
    return within(secondStepContent).getByText(/steps.step2.title/i);
  });
  return secondStepContentTitle;
};

const completeFirstStepNewPlaylist = async () => {
  const playlistNameInput = screen.getByLabelText(
    /steps.step1.form.createNewPlaylist.giveAName/i
  );
  await userEvent.type(playlistNameInput, 'My new playlist');

  await clickToNextButton();
};

const findAndSelectArtist = async (artistName: string) => {
  const searchInput = screen.getByPlaceholderText(
    'steps.step2.searchPlaceholder'
  );
  await userEvent.type(searchInput, artistName);

  await waitFor(() => {
    const itemOption = screen.getByRole('option', {
      name: artistName,
    });
    expect(itemOption).toBeInTheDocument();
    userEvent.click(itemOption);
  });
};

const findAndSelectPlaylist = async (playlistName: string) => {
  const triggerInput = screen.getByRole('combobox');
  await userEvent.click(triggerInput);

  const searchInput = screen.getByPlaceholderText(
    /steps.step1.form.useExistingPlaylist.playlistSelector.placeholder/i
  );
  await userEvent.type(searchInput, playlistName);

  await waitFor(() => {
    const itemOption = screen.getByRole('option', {
      name: playlistName,
    });
    expect(itemOption).toBeInTheDocument();
    userEvent.click(itemOption);
  });
};

const playlistsService = {
  searchPlaylists: vi.fn(),
  createNewPlaylist: vi.fn(),
};

const artistsService = {
  searchArtists: vi.fn(),
};

const mockServices = {
  playlistsService,
  artistsService,
};

const MockServiceProvider = ({ children }: { children: ReactNode }) => {
  return <ServiceProvider value={mockServices}>{children}</ServiceProvider>;
};

const customRenderWithProviders = (ui: ReactNode) => {
  return render(ui, { wrapper: MockServiceProvider });
};

describe('GeneratePlaylistPage', () => {

  let searchResultArtists = ['Holding Absence'];
  let createdPlaylistId = '123';

  beforeEach(() => {
    artistsService.searchArtists.mockResolvedValue({
      artists: searchResultArtists.map(name => ({ name: name, imageUri: null }))
    });

    playlistsService.createNewPlaylist.mockResolvedValue({
      playlistCreated: { id: createdPlaylistId },
    });
  });

  it('should render the form with the first step displayed', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const firstNavigationStepButton = screen.getByRole('button', {
      name: /steps.step1.title/i,
    });
    expect(firstNavigationStepButton).toBeInTheDocument();
    expect(
      within(firstNavigationStepButton).getByText(/steps.step1.description/i)
    ).toBeInTheDocument();

    const nextButton = screen.getByRole('button', {
      name: /steps.navigation.next/i,
    });
    expect(nextButton).toBeInTheDocument();

    const previousButton = screen.queryByRole('button', {
      name: /steps.navigation.previous/i,
    });
    expect(previousButton).not.toBeInTheDocument();

    const firstStepContent = screen.getByRole('tabpanel');
    expect(
      within(firstStepContent).getByText(/steps.step1.title/i)
    ).toBeInTheDocument();
    expect(
      within(firstStepContent).getByText(/steps.step1.description/i)
    ).toBeInTheDocument();
  });

  it('should display the error message when the "Create new playlist" option is selected and the playlist name is not filled', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const createNewPlaylistRadio = screen.getByRole('radio', {
      name: /steps.step1.form.createNewPlaylist.title/i,
    });
    await userEvent.click(createNewPlaylistRadio);

    const publicPlaylistSwitch = screen.getByRole('switch', {
      name: /steps.step1.form.createNewPlaylist.publicPlaylist.title/i,
    });
    await userEvent.click(publicPlaylistSwitch);

    await clickToNextButton();

    const playlistNameError = await waitFor(() => {
      return screen.getByText(/steps.errors.name.required/i);
    });

    expect(playlistNameError).toBeInTheDocument();
  });

  it('should display the error message when the "Use existing playlist" option is selected and the playlist is not selected', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const useExistingPlaylistRadio = screen.getByRole('radio', {
      name: /steps.step1.form.useExistingPlaylist.title/i,
    });
    await userEvent.click(useExistingPlaylistRadio);

    await clickToNextButton();

    const playlistSelectedError = await waitFor(() => {
      return screen.getByText(/steps.errors.playlistSelected.required/i);
    });

    expect(playlistSelectedError).toBeInTheDocument();
  });

  it('should fill the form and navigate to the next step when clicking the next button', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const createNewPlaylistRadio = screen.getByRole('radio', {
      name: /steps.step1.form.createNewPlaylist.title/i,
    });
    await userEvent.click(createNewPlaylistRadio);

    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    );
    await userEvent.type(playlistNameInput, 'My new playlist');

    const publicPlaylistSwitch = screen.getByRole('switch', {
      name: /steps.step1.form.createNewPlaylist.publicPlaylist.title/i,
    });
    await userEvent.click(publicPlaylistSwitch);

    await clickToNextButton();

    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole('tabpanel');
      return within(secondStepContent).getByText(/steps.step2.title/i);
    });

    expect(secondStepContentTitle).toBeInTheDocument();
  });

  it('should navigate to the previous step when clicking the previous button', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    );
    await userEvent.type(playlistNameInput, 'My new playlist');

    await clickToNextButton();

    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole('tabpanel');
      return within(secondStepContent).getByText(/steps.step2.title/i);
    });

    expect(secondStepContentTitle).toBeInTheDocument();

    const previousButton = screen.getByRole('button', {
      name: /steps.navigation.previous/i,
    });
    await userEvent.click(previousButton);

    const firstStepContent = screen.getByRole('tabpanel');
    await waitFor(() => {
      within(firstStepContent).getByText(/steps.step1.title/i);
    });
  });

  it('should create the new playlist and display the success message', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    );
    await userEvent.type(playlistNameInput, 'My new playlist');

    const playlistDescriptionInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveADescription/i
    );
    await userEvent.type(
      playlistDescriptionInput,
      'My new playlist description'
    );

    await clickToNextButton();

    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole('tabpanel');
      return within(secondStepContent).getByText(/steps.step2.title/i);
    });

    expect(secondStepContentTitle).toBeInTheDocument();

    await findAndSelectArtist('Holding Absence');

    const generateButton = screen.getByRole('button', {
      name: /steps.navigation.generate/i,
    });
    await userEvent.click(generateButton);

    const thirdStepContentTitle = await waitFor(() => {
      const thirdStepContent = screen.getByRole('tabpanel');
      return within(thirdStepContent).getByText(/steps.step3.title/i);
    });

    expect(thirdStepContentTitle).toBeInTheDocument();

    const successfullyMessage = screen.getByText(
      /steps.step3.playlisyGeneratedSuccessfully/i
    );
    expect(successfullyMessage).toBeInTheDocument();

    expect(playlistsService.createNewPlaylist).toHaveBeenCalledWith({
      playlist: {
        name: 'My new playlist',
        description: 'My new playlist description',
        isPublic: false,
      },
      artists: [
        {
          name: 'Holding Absence',
        },
      ],
    });
  });

  it('should show the embedded playlist on successful update', async () => {
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    );
    await userEvent.type(playlistNameInput, 'My new playlist');

    await clickToNextButton();

    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole('tabpanel');
      return within(secondStepContent).getByText(/steps.step2.title/i);
    });

    expect(secondStepContentTitle).toBeInTheDocument();

    await findAndSelectArtist('Holding Absence');

    const generateButton = screen.getByRole('button', {
      name: /steps.navigation.generate/i,
    });
    await userEvent.click(generateButton);

    const thirdStepContentTitle = await waitFor(() => {
      const thirdStepContent = screen.getByRole('tabpanel');
      return within(thirdStepContent).getByText(/steps.step3.title/i);
    });
    const embeddedPlaylist = screen.queryByTitle('Spotify embedded playlist');

    expect(thirdStepContentTitle).toBeInTheDocument();
    expect(embeddedPlaylist).toHaveAttribute('src', `https://open.spotify.com/embed/playlist/${createdPlaylistId}`);
  });

  it('should display an error when it tries to submitting the form', async () => {
    playlistsService.createNewPlaylist.mockRejectedValue({
      error: 'Error creating playlist',
    });

    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const playlistNameInput = screen.getByLabelText(
      /steps.step1.form.createNewPlaylist.giveAName/i
    );
    await userEvent.type(playlistNameInput, 'My new playlist');

    await clickToNextButton();

    const secondStepContentTitle = await waitFor(() => {
      const secondStepContent = screen.getByRole('tabpanel');
      return within(secondStepContent).getByText(/steps.step2.title/i);
    });

    expect(secondStepContentTitle).toBeInTheDocument();

    await findAndSelectArtist('Holding Absence');

    const generateButton = screen.getByRole('button', {
      name: /steps.navigation.generate/i,
    });
    await userEvent.click(generateButton);

    expect(toast.error).toHaveBeenCalledWith(
      'steps.errors.createNewPlaylist.unexpectedError'
    );
  });

  it('should select a existing playlist when the "Use existing playlist" option is selected and the playlist is selected', async () => {
    playlistsService.searchPlaylists.mockResolvedValue({
      playlists: [
        {
          id: '1',
          name: 'My playlist',
          description: 'My playlist description',
          isPublic: true,
        },
      ],
    });
    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    const useExistingPlaylistRadio = screen.getByRole('radio', {
      name: /steps.step1.form.useExistingPlaylist.title/i,
    });
    await userEvent.click(useExistingPlaylistRadio);

    const playlistName = 'My playlist';
    await findAndSelectPlaylist(playlistName);

    const selectedItem = screen.getByText(playlistName);
    expect(selectedItem).toBeInTheDocument();
  });

  it('should select multiple artists when searching for them and clicking on them', async () => {
    artistsService.searchArtists.mockResolvedValue({
      artists: [
        {
          name: 'Holding Absence',
          imageUri: null,
        },
        {
          name: 'HOLD',
          imageUri: null,
        },
      ],
    });

    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    await completeFirstStepNewPlaylist();
    expect(await waitForSecondStepContent()).toBeInTheDocument();

    const firstArtistName = 'Holding Absence';
    await findAndSelectArtist(firstArtistName);

    const selectedFirstArtistItem = screen.getByText(firstArtistName);
    expect(selectedFirstArtistItem).toBeInTheDocument();

    const secondArtistName = 'HOLD';
    await findAndSelectArtist(secondArtistName);

    const selectedSecondArtistItem = screen.getByText(secondArtistName);
    expect(selectedSecondArtistItem).toBeInTheDocument();

    await waitFor(() => {
      const removeButtons = screen.getAllByLabelText(
        /steps.step2.removeArtist/i
      );
      expect(removeButtons).toHaveLength(2);
    });
  });

  it('should remove an artist that was selected when you clicked the remove button', async () => {
    artistsService.searchArtists.mockResolvedValue({
      artists: [
        {
          name: 'Holding Absence',
          imageUri: null,
        },
        {
          name: 'HOLD',
          imageUri: null,
        },
      ],
    });

    customRenderWithProviders(<GeneratePlaylistPage {...staticTranslations} />);

    await completeFirstStepNewPlaylist();
    expect(await waitForSecondStepContent()).toBeInTheDocument();

    const artistName = 'Holding Absence';
    await findAndSelectArtist(artistName);

    const selectedArtistItem = screen.getByText(artistName);
    expect(selectedArtistItem).toBeInTheDocument();

    await waitFor(async () => {
      const removeButton = screen.getByLabelText(
        `steps.step2.removeArtist ${artistName}`
      );
      expect(removeButton).toBeInTheDocument();
      await userEvent.click(removeButton);
    });

    const selectedItemRemoved = screen.queryByText('Holding Absence');
    expect(selectedItemRemoved).not.toBeInTheDocument();
  });
});
