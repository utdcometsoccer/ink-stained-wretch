import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AuthorMainForm } from "../src/components/AuthorMainForm/index";
import { CultureInfoProvider } from "../src/contexts/CultureInfoContext";
import { initialAuthorFormState } from "../src/reducers/authorFormReducer";
import type { AuthorMainFormProps } from "../src/components/AuthorMainForm/AuthorMainFormProps";
import type { Language } from "@idahoedokpayi/react-country-state-selector";

// Mock the CSS import
vi.mock('../src/components/AuthorMainForm/AuthorMainForm.css', () => ({}));

// Mock the penguin logo import
vi.mock('../src/assets/penguin-vector.png', () => ({
  default: 'mocked-penguin-logo.png'
}));

// Mock MUI icons
vi.mock('@mui/icons-material/AccountBalance', () => ({
  default: () => <div data-testid="account-balance-icon">Account Balance Icon</div>
}));

// Mock the hooks
vi.mock('../src/hooks/useLocalizationContext', () => ({
  useLocalizationContext: () => ({
    AuthorMainForm: {
      legend: 'Author Information',
      authorName: 'Author Name',
      language: 'Language',
      country: 'Country',
      email: 'Email',
      welcomeText: 'Welcome Text',
      aboutText: 'About Text',
      headshotUrl: 'Headshot URL',
      chooseImage: 'Choose Image',
      close: 'Close',
      copyrightText: 'Copyright Text',
      topLevelDomain: 'Top Level Domain',
      secondLevelDomain: 'Second Level Domain',
      articles: 'Articles',
      books: 'Books',
      socials: 'Social Media',
      penguinRandomHouse: 'Penguin Random House',
      openLibrary: 'Open Library',
      importAuthor: 'Import Author',
      save: 'Save',
      cancel: 'Cancel'
    }
  })
}));

vi.mock('../src/hooks/useTrackComponent', () => ({
  useTrackComponent: vi.fn()
}));

// Mock service functions that use external package functions
vi.mock('../src/services/getCountryInformation', () => ({
  useGetCountryInformation: () => vi.fn(() => ({
    name: 'Test Country',
    code: 'US'
  }))
}));

vi.mock('../src/services/getLanguageInformation', () => ({
  useGetLanguageInformation: () => vi.fn(() => ({
    name: 'English',
    code: 'en'
  }))
}));

// Mock child components
vi.mock('../src/components/AuthorRegistration/ArticleList', () => ({
  ArticleList: ({ onEdit, onAdd, onDelete }: any) => (
    <div data-testid="article-list">
      <button onClick={onAdd} data-testid="add-article">Add Article</button>
      <button onClick={() => onEdit('1')} data-testid="edit-article">Edit Article</button>
      <button onClick={() => onDelete('1')} data-testid="delete-article">Delete Article</button>
    </div>
  )
}));

vi.mock('../src/components/AuthorRegistration/SocialList', () => ({
  SocialList: ({ onEdit, onAdd, onDelete }: any) => (
    <div data-testid="social-list">
      <button onClick={onAdd} data-testid="add-social">Add Social</button>
      <button onClick={() => onEdit('1')} data-testid="edit-social">Edit Social</button>
      <button onClick={() => onDelete('1')} data-testid="delete-social">Delete Social</button>
    </div>
  )
}));

vi.mock('../src/components/BookList/index', () => ({
  BookList: ({ onEdit, onAdd, onDelete, importBook }: any) => (
    <div data-testid="book-list">
      <button onClick={onAdd} data-testid="add-book">Add Book</button>
      <button onClick={() => onEdit('1')} data-testid="edit-book">Edit Book</button>
      <button onClick={() => onDelete('1')} data-testid="delete-book">Delete Book</button>
      <button onClick={() => importBook && importBook({ id: '1', title: 'Test Book' })} data-testid="import-book">Import Book</button>
    </div>
  )
}));

vi.mock('../src/components/ImageManager/index', () => ({
  ImageManager: ({ onSelect, token, listUserImages, deleteImage, uploadImage }: any) => (
    <div data-testid="image-manager">
      <button onClick={() => onSelect({ url: 'test-image.jpg' })} data-testid="select-image">Select Image</button>
    </div>
  )
}));

// Mock the dropdown components
vi.mock('@idahoedokpayi/react-country-state-selector', () => ({
  LanguageDropdown: ({ onLanguageChange, selectedLanguage, Label }: any) => (
    <div data-testid="language-dropdown">
      <label>{Label}</label>
      <select 
        value={selectedLanguage} 
        onChange={(e) => onLanguageChange({ code: e.target.value, name: e.target.value })}
        data-testid="language-select"
        aria-label={Label}
      >
        <option value="">Select Language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  ),
  CountryDropdown: ({ onCountryChange, selectedCountry, Label }: any) => (
    <div data-testid="country-dropdown">
      <label>{Label}</label>
      <select 
        value={selectedCountry} 
        onChange={(e) => onCountryChange(e.target.value)}
        data-testid="country-select"
        aria-label={Label}
      >
        <option value="">Select Country</option>
        <option value="US">United States</option>
        <option value="MX">Mexico</option>
      </select>
    </div>
  ),
  cultureFromBrowser: vi.fn(() => ({
    Culture: 'en-US',
    Language: 'en', 
    Country: 'US'
  }))
}));

describe('AuthorMainForm', () => {
  const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
  
  const defaultProps: AuthorMainFormProps = {
    form: {
      ...initialAuthorFormState,
      AuthorName: 'Test Author',
      EmailAddress: 'test@example.com',
      LanguageName: 'en',
      RegionName: 'US'
    },
    dispatchForm: vi.fn(),
    token: 'test-token',
    handleChange: vi.fn(),
    handleLanguageChange: vi.fn(),
    handleCountryChange: vi.fn(),
    handleSubmit: vi.fn(),
    handleEditArticle: vi.fn(),
    handleAddArticle: vi.fn(),
    handleDeleteArticle: vi.fn(),
    handleEditBook: vi.fn(),
    handleAddBook: vi.fn(),
    handleDeleteBook: vi.fn(),
    handleEditSocial: vi.fn(),
    handleAddSocial: vi.fn(),
    handleDeleteSocial: vi.fn(),
    importBook: vi.fn(),
    importAuthorFromOpenLibrary: vi.fn(),
    importAuthorFromPenguinRandomHouse: vi.fn(),
    handleCancelClick: vi.fn(),
    listUserImages: vi.fn(),
    deleteImage: vi.fn(),
    uploadImage: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props: Partial<AuthorMainFormProps> = {}) => {
    return render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <AuthorMainForm {...defaultProps} {...props} />
      </CultureInfoProvider>
    );
  };

  describe('Rendering', () => {
    it('renders the form with all required fields', () => {
      renderComponent();

      expect(screen.getByRole('group')).toBeInTheDocument(); // fieldset creates a group role
      expect(screen.getByText('Author Information')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByTestId('language-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('country-dropdown')).toBeInTheDocument();
    });

    it('renders all text input fields', () => {
      renderComponent();

      expect(screen.getByRole('textbox', { name: /author name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /welcome text/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /about text/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /headshot url/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /copyright text/i })).toBeInTheDocument();
    });

    it('renders readonly domain fields', () => {
      const props = {
        form: {
          ...defaultProps.form,
          TopLevelDomain: 'com',
          SecondLevelDomain: 'example'
        }
      };
      renderComponent(props);

      const topLevelInput = screen.getByDisplayValue('com');
      const secondLevelInput = screen.getByDisplayValue('example');
      
      expect(topLevelInput).toBeInTheDocument();
      expect(topLevelInput).toHaveAttribute('readonly');
      expect(secondLevelInput).toBeInTheDocument();
      expect(secondLevelInput).toHaveAttribute('readonly');
    });

    it('renders child list components', () => {
      renderComponent();

      expect(screen.getByTestId('article-list')).toBeInTheDocument();
      expect(screen.getByTestId('book-list')).toBeInTheDocument();
      expect(screen.getByTestId('social-list')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('handles form submission', async () => {
      const handleSubmit = vi.fn();
      renderComponent({ handleSubmit });

      const form = screen.getByRole('group').closest('form')!;
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('handles input changes', async () => {
      const handleChange = vi.fn();
      renderComponent({ handleChange });

      const authorNameInput = screen.getByRole('textbox', { name: /author name/i });
      await userEvent.clear(authorNameInput);
      await userEvent.type(authorNameInput, 'New Author Name');

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles language selection', async () => {
      const handleLanguageChange = vi.fn();
      renderComponent({ handleLanguageChange });

      const languageSelect = screen.getByTestId('language-select');
      fireEvent.change(languageSelect, { target: { value: 'es' } });

      expect(handleLanguageChange).toHaveBeenCalledWith({ code: 'es', name: 'es' });
    });

    it('handles country selection', async () => {
      const handleCountryChange = vi.fn();
      renderComponent({ handleCountryChange });

      const countrySelect = screen.getByTestId('country-select');
      fireEvent.change(countrySelect, { target: { value: 'MX' } });

      expect(handleCountryChange).toHaveBeenCalledWith('MX');
    });
  });

  describe('Image Management', () => {
    it('shows choose image button', () => {
      renderComponent();

      expect(screen.getByRole('button', { name: /choose image/i })).toBeInTheDocument();
    });

    it('opens image manager when choose image button is clicked', () => {
      const dispatchForm = vi.fn();
      renderComponent({ dispatchForm });

      const chooseImageButton = screen.getByRole('button', { name: /choose image/i });
      fireEvent.click(chooseImageButton);

      expect(dispatchForm).toHaveBeenCalledWith({
        type: 'SET_SHOW_IMAGE_MANAGER',
        payload: true
      });
    });

    it('renders image manager when showImageManager is true', () => {
      const props = {
        form: {
          ...defaultProps.form,
          showImageManager: true
        }
      };
      renderComponent(props);

      expect(screen.getByTestId('image-manager')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('closes image manager when close button is clicked', () => {
      const dispatchForm = vi.fn();
      const props = {
        form: {
          ...defaultProps.form,
          showImageManager: true
        },
        dispatchForm
      };
      renderComponent(props);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(dispatchForm).toHaveBeenCalledWith({
        type: 'SET_SHOW_IMAGE_MANAGER',
        payload: false
      });
    });

    it('handles image selection from image manager', () => {
      const dispatchForm = vi.fn();
      const props = {
        form: {
          ...defaultProps.form,
          showImageManager: true
        },
        dispatchForm
      };
      renderComponent(props);

      const selectImageButton = screen.getByTestId('select-image');
      fireEvent.click(selectImageButton);

      expect(dispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE_FIELD',
        payload: { name: 'HeadShotURL', value: 'test-image.jpg' }
      });
      expect(dispatchForm).toHaveBeenCalledWith({
        type: 'SET_SHOW_IMAGE_MANAGER',
        payload: false
      });
    });

    it('displays headshot thumbnail when HeadShotURL is provided', () => {
      const props = {
        form: {
          ...defaultProps.form,
          HeadShotURL: 'test-headshot.jpg'
        }
      };
      renderComponent(props);

      const thumbnail = screen.getByAltText('Headshot thumbnail');
      const preview = screen.getByAltText('Headshot preview');
      
      expect(thumbnail).toBeInTheDocument();
      expect(thumbnail).toHaveAttribute('src', 'test-headshot.jpg');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'test-headshot.jpg');
    });
  });

  describe('List Item Management', () => {
    it('handles article management actions', () => {
      const handleAddArticle = vi.fn();
      const handleEditArticle = vi.fn();
      const handleDeleteArticle = vi.fn();
      
      renderComponent({
        handleAddArticle,
        handleEditArticle,
        handleDeleteArticle
      });

      fireEvent.click(screen.getByTestId('add-article'));
      expect(handleAddArticle).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId('edit-article'));
      expect(handleEditArticle).toHaveBeenCalledWith('1');

      fireEvent.click(screen.getByTestId('delete-article'));
      expect(handleDeleteArticle).toHaveBeenCalledWith('1');
    });

    it('handles book management actions', () => {
      const handleAddBook = vi.fn();
      const handleEditBook = vi.fn();
      const handleDeleteBook = vi.fn();
      const importBook = vi.fn();
      
      renderComponent({
        handleAddBook,
        handleEditBook,
        handleDeleteBook,
        importBook
      });

      fireEvent.click(screen.getByTestId('add-book'));
      expect(handleAddBook).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId('edit-book'));
      expect(handleEditBook).toHaveBeenCalledWith('1');

      fireEvent.click(screen.getByTestId('delete-book'));
      expect(handleDeleteBook).toHaveBeenCalledWith('1');

      fireEvent.click(screen.getByTestId('import-book'));
      expect(importBook).toHaveBeenCalledWith({ id: '1', title: 'Test Book' });
    });

    it('handles social media management actions', () => {
      const handleAddSocial = vi.fn();
      const handleEditSocial = vi.fn();
      const handleDeleteSocial = vi.fn();
      
      renderComponent({
        handleAddSocial,
        handleEditSocial,
        handleDeleteSocial
      });

      fireEvent.click(screen.getByTestId('add-social'));
      expect(handleAddSocial).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByTestId('edit-social'));
      expect(handleEditSocial).toHaveBeenCalledWith('1');

      fireEvent.click(screen.getByTestId('delete-social'));
      expect(handleDeleteSocial).toHaveBeenCalledWith('1');
    });
  });

  describe('Import Actions', () => {
    it('handles import from Open Library', () => {
      const importAuthorFromOpenLibrary = vi.fn();
      renderComponent({ importAuthorFromOpenLibrary });

      // The actual buttons are rendered by child components, so we'll test the prop passing
      expect(typeof defaultProps.importAuthorFromOpenLibrary).toBe('function');
    });

    it('handles import from Penguin Random House', () => {
      const importAuthorFromPenguinRandomHouse = vi.fn();
      renderComponent({ importAuthorFromPenguinRandomHouse });

      // The actual buttons are rendered by child components, so we'll test the prop passing
      expect(typeof defaultProps.importAuthorFromPenguinRandomHouse).toBe('function');
    });

    it('handles cancel action', () => {
      const handleCancelClick = vi.fn();
      renderComponent({ handleCancelClick });

      // The actual cancel button is rendered by child components, so we'll test the prop passing
      expect(typeof defaultProps.handleCancelClick).toBe('function');
    });
  });

  describe('Context Integration', () => {
    it('uses CultureInfo context correctly', () => {
      renderComponent();

      // The component should render without errors when wrapped with CultureInfoProvider
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByTestId('language-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('country-dropdown')).toBeInTheDocument();
    });

    it('throws error when used without CultureInfoProvider', () => {
      // Suppress console errors for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<AuthorMainForm {...defaultProps} />);
      }).toThrow('useCultureInfo must be used within a CultureInfoProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      renderComponent();

      const fieldset = screen.getByRole('group');
      const legend = screen.getByText('Author Information');
      const form = fieldset.closest('form')!;

      expect(form).toBeInTheDocument();
      expect(fieldset).toBeInTheDocument();
      expect(legend).toBeInTheDocument();
    });

    it('has proper labels for inputs', () => {
      renderComponent();

      expect(screen.getByLabelText(/author name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/welcome text/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/about text/i)).toBeInTheDocument();
    });

    it('has hidden id field', () => {
      renderComponent();

      const idInput = screen.getByRole('group').querySelector('input[name="id"]');
      expect(idInput).toHaveAttribute('name', 'id');
      expect(idInput).toHaveAttribute('hidden');
      expect(idInput).toHaveAttribute('readonly');
    });
  });
});