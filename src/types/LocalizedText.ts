
import type { AuthorDocListText } from "./AuthorDocListText";
import type { BookFormText } from "./BookFormText";
import type { ChooseSubscriptionText } from "./ChooseSubscriptionText";
import type { SocialFormText } from "./SocialFormText";
import type { SocialListText } from "./SocialListText";

export interface ArticleFormText {
    legend: string;
    title: string;
    date: string;
    publication: string;
    url: string;
    save: string;
    cancel: string;
}

export interface AuthGuardText {
    title: string;
    message: string;
    buttonLabel: string;
}

export interface ArticleListText {
    title: string;
    date: string;
    publication: string;
    url: string;
    edit: string;
    delete: string;
    addArticle: string;
}

export interface AuthorMainFormText {
    legend: string;
    authorName: string;
    language: string;
    country: string;
    email: string;
    welcomeText: string;
    aboutText: string;
    headshotUrl: string;
    chooseImage: string;
    close: string;
    copyrightText: string;
    topLevelDomain: string;
    secondLevelDomain: string;
    articles: string;
    books: string;
    socialLinks: string;
    importAuthor: string;
    importPenguinAuthor: string;
    save: string;
    cancel: string;
};

export interface AuthorRegistrationText {
    authorListTitle: string;
    languageLabel: string;
    regionLabel: string;
    editAuthor: string;
    deleteAuthor: string;
    addAuthor: string;
    continue: string;
}

export interface BookListText {
    title: string;
    description: string;
    url: string;
    edit: string;
    delete: string;
    addBook: string;
    importOpenLibrary: string;
    importGoogleBooks: string;
    importPenguinBooks: string;
    importAmazonBooks: string;
}

export interface CheckoutText {    
    selectPlan: string;
    formTitle: string;
    errorMessage: string;
    buttonLabel: string;
}

export interface ChooseCultureText {
    title: string;
    subtitle: string;
    legend: string;
    languageLabel: string;
    countryLabel: string;
    continue: string;
    cancel: string;
    cookieConsent: string;
    cookiesInfo: string;
}

// ...interface imported above...

export interface CountdownIndicatorText {
    redirecting: string;
}

export interface DomainInputText {
    label: string;
    placeholder: string;
    error: string;
    success: string;
}

export interface DomainRegistrationText {
    title: string;
    subtitle: string;
    submit: string;
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    emailAddress: string;
    telephoneNumber: string;
}

export interface DomainRegistrationsListText {
    title: string;
    error: string;
    loading: string;
    empty: string;
    select: string;
    selected: string;
}

export interface ErrorPageText {
    title: string;
    devMessage: string;
    details: string;
    tryAgain: string;
    userMessage: string;
    return: string;
}

export interface ImageManagerText {
    title: string;
    loading: string;
    select: string;
    delete: string;
    refresh: string;
    uploadTitle: string;
    uploadText: string;
    uploadButton: string;
    supportedFormats: string;
    uploading: string;
    uploadSuccess: string;
}

export interface LoginRegisterText {
    loginHeader: {
        title: string;
        subtitle: string;
    };
    loginButton: {
        label: string;
    };
    logoutButton: {
        label: string;
    };
    countdownIndicator: {
        text: string;
    }
}

export interface NavbarText {
    brand: string;
    navigation: string;
    close: string;
    navItems: {
        chooseCulture: { label: string; description: string };
        login: { label: string; description: string };
        domainRegistration: { label: string; description: string };
        authorPage: { label: string; description: string };
        subscribe: { label: string; description: string };
        thankYou: { label: string; description: string };
    };
}

export interface OpenLibraryAuthorFormText {
    legend: string;
    key: string;
    text: string;
    type: string;
    name: string;
    alternateNames: string;
    birthDate: string;
    topWork: string;
    workCount: string;
    topSubjects: string;
    version: string;
    save: string;
    cancel: string;
}

export interface PenguinRandomHouseAuthorDetailText {
    title: string;
    name: string;
    score: string;
    url: string;
    domain: string;
    titleField: string;
    description: string;
    authorFirst: string;
    authorLast: string;
    photoCredit: string;
    onTour: string;
    seriesAuthor: string;
    seriesIsbn: string;
    seriesCount: string;
    keywordId: string;
    save: string;
    cancel: string;
}

export interface PenguinRandomHouseAuthorListText {
    title: string;
    import: string;
    importTitle: string;
    goBack: string;
    noResults: string;
}

export interface ThankYouText {
    title: string;
    message: string;
}

export interface LocalizedText {
    ArticleForm: ArticleFormText;
    ArticleList: ArticleListText;
    AuthGuard: AuthGuardText;
    AuthorDocList: AuthorDocListText;
    AuthorMainForm: AuthorMainFormText;
    AuthorRegistration: AuthorRegistrationText;
    BookForm: BookFormText;
    BookList: BookListText;
    Checkout: CheckoutText;
    ChooseCulture: ChooseCultureText;
    ChooseSubscription: ChooseSubscriptionText;
    CountdownIndicator: CountdownIndicatorText;
    DomainInput: DomainInputText;
    DomainRegistration: DomainRegistrationText;
    DomainRegistrationsList: DomainRegistrationsListText;
    ErrorPage: ErrorPageText;
    ImageManager: ImageManagerText;
    LoginRegister: LoginRegisterText;
    Navbar: NavbarText;
    OpenLibraryAuthorForm: OpenLibraryAuthorFormText;
    PenguinRandomHouseAuthorDetail: PenguinRandomHouseAuthorDetailText;
    PenguinRandomHouseAuthorList: PenguinRandomHouseAuthorListText;
    SocialForm: SocialFormText;
    SocialList: SocialListText;
    ThankYou: ThankYouText;
}
