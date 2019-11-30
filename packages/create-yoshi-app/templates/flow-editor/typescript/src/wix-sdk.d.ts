declare namespace Wix {
  interface IWixStatic {
    requestLogin(options: any, onSuccess?: Function, onCancel?: Function): void;

    addEventListener(
      eventName: IWixEvents,
      callback: (event: any) => void,
    ): void;

    closeWindow(message?: Record<string, any>): void;

    currentMember(callback: (memberDetails: IMemberDetails) => void): void;

    getAdsOnPage(callback: (ads: Record<string, any>) => void): void;

    getBoundingRectAndOffsets(
      callback: (data: IGetBoundingRectAndOffsets) => void,
    ): void;

    getComponentInfo(callback: (compInfo: IGetComponentInfo) => void): void;

    getCurrentPageAnchors(callback: (anchors: Array<IAnchor>) => void): void;

    getCurrentPageId(callback: (pageId: string) => void): void;

    getSiteInfo(callback: (siteInfo: ISiteInfo) => void): void;

    getSiteMap(callback: (siteMap: Array<ISiteMapPageLink>) => void): void;

    getStateUrl(
      sectionId: string,
      state: string,
      callback: (data: Record<string, any>) => void,
    ): void;

    isAppSectionInstalled(
      sectionId: string,
      options: IIsAppSectionInstalledOptions,
      onResult: (isInstalled: boolean) => void,
    ): void;

    isVisualFocusEnabled(callback: (isA11yEnabled: boolean) => void): void;

    logOutCurrentMember(onError?: () => void): void;

    navigateTo(linkData: ILinkType, onError?: () => void): void;

    navigateToAnchor(anchorId: string, onError?: (error?: any) => void): void;

    navigateToComponent(
      compId: string,
      options?: { pageId: string },
      onError?: (error?: any) => void,
    ): void;

    navigateToPage(
      pageId: string,
      options?: { anchorId: string },
      onError?: (error?: any) => void,
    ): void;

    openModal(
      url: string,
      width: number,
      height: number,
      onClose?: (data?: { message: any } | undefined) => void,
      theme?: IWixTheme,
    ): void;

    openPopup(
      url: string,
      width: number | string,
      height: number | string,
      position: IPopupPosition,
      onClose?: (message?: any) => void,
      theme?: IWixTheme,
    ): void;

    openPersistentPopup(options: {
      url: string;
      width: number | string;
      height: number | string;
      position: IPopupPosition;
      theme?: IWixTheme;
    }): Promise<any>;

    scrollBy(x: number, y: number): void;

    scrollTo(x: number, y: number): void;

    setHeight(height: number, options?: { overflow: boolean }): void;

    resizeComponent(
      options: { width: number; height: number },
      onSuccess?: () => void,
      onError?: (error?: any) => void,
    ): void;

    getApplicationFields(appDefinitionId: string, onSuccess: Function): void;

    getExternalId(callback: (externalId: string) => void): void;

    setPageMetadata(options: { title: string; description: string }): void;

    getPublicAPI(
      options: { appDefinitionId: string },
      onSuccess?: (api: any) => void,
      onError?: (error?: any) => void,
    ): void;

    Settings: IWixSettings;

    SuperApps?: {
      Settings: {
        openBillingPage: Function;
        openModal: Function;
        getApplicationFields: Function;
      };
    };

    Styles: IWixStyles;

    Performance: {
      applicationLoaded(): void;
      applicationLoadingStep(
        stageNumber: number,
        stageDescription: string,
      ): void;
    };

    Analytics: {
      PixelType: {
        FACEBOOK: string;
      };
      PixelEventType: {
        ADD_PAYMENT_INFO: PixelEventType;
        ADD_TO_CART: PixelEventType;
        ADD_TO_WISHLIST: PixelEventType;
        COMPLETE_REGISTRATION: PixelEventType;
        CUSTOM_EVENT: PixelEventType;
        INITIATE_CHECKOUT: PixelEventType;
        LEAD: PixelEventType;
        PURCHASE: PixelEventType;
        SEARCH: PixelEventType;
        VIEW_CONTENT: PixelEventType;
      };
      registerCampaignPixel(pixelType: string, pixelId: string): void;
      reportCampaignEvent(pixelEventType: string, data?: object): void;
      trackEvent(eventName: ITrackEventName, params: ITrackEventParams): void;
    };

    Theme: {
      DEFAULT: 'DEFAULT';
      BARE: 'BARE';
    };

    Events: {
      COMPONENT_DELETED: 'COMPONENT_DELETED';
      DEVICE_TYPE_CHANGED: 'DEVICE_TYPE_CHANGED';
      EDIT_MODE_CHANGE: 'EDIT_MODE_CHANGE';
      ON_MESSAGE_RESPONSE: 'ON_MESSAGE_RESPONSE';
      PAGE_NAVIGATION: 'PAGE_NAVIGATION';
      PAGE_NAVIGATION_CHANGE: 'PAGE_NAVIGATION_CHANGE';
      PAGE_NAVIGATION_IN: 'PAGE_NAVIGATION_IN';
      PAGE_NAVIGATION_OUT: 'PAGE_NAVIGATION_OUT';
      PUBLIC_DATA_CHANGED: 'PUBLIC_DATA_CHANGED';
      SCROLL: 'SCROLL';
      SESSION_CHANGED: 'SESSION_CHANGED';
      SETTINGS_UPDATED: 'SETTINGS_UPDATED';
      SITE_METADATA_CHANGED: 'SITE_METADATA_CHANGED';
      SITE_PUBLISHED: 'SITE_PUBLISHED';
      SITE_SAVED: 'SITE_SAVED';
      STATE_CHANGED: 'STATE_CHANGED';
      STYLE_PARAMS_CHANGE: 'STYLE_PARAMS_CHANGE';
      THEME_CHANGE: 'THEME_CHANGE';
      WINDOW_PLACEMENT_CHANGED: 'WINDOW_PLACEMENT_CHANGED';
      INSTANCE_CHANGED: 'INSTANCE_CHANGED';
    };

    Utils: IWixUtils;

    PubSub: IWixPubSub;

    Data: {
      Public: IWixDataPublic;
      SCOPE: {
        APP: 'APP';
        COMPONENT: 'COMPONENT';
      };
    };

    Features: {
      isSupported: (
        featureType: IWixFeatureType,
        callback: (result: boolean) => void,
      ) => void;
      Types: {
        ADD_COMPONENT: 'ADD_COMPONENT';
        PREVIEW_TO_SETTINGS: 'PREVIEW_TO_SETTINGS';
        RESIZE_COMPONENT: 'RESIZE_COMPONENT';
      };
    };

    WindowOrigin: {
      ABSOLUTE: string;
      DEFAULT: string;
      FIXED: string;
      RELATIVE: string;
    };

    WindowPlacement: {
      BOTTOM_CENTER: string;
      BOTTOM_LEFT: string;
      BOTTOM_RIGHT: string;
      CENTER: string;
      CENTER_LEFT: string;
      CENTER_RIGHT: string;
      TOP_CENTER: string;
      TOP_LEFT: string;
      TOP_RIGHT: string;
    };
  }

  interface IWixSettings {
    addComponent: (
      compData: object,
      onSuccess: (compId: string) => any,
      onError: (error: any) => any,
    ) => void;
    closeWindow: Function;
    getCurrentPageId: (callback: (currentPageID: string) => any) => void;
    getDashboardAppUrl: Function;
    getSiteInfo: Function;
    getSiteMap: (callback: (siteMap: Array<ISiteMapPageLink>) => void) => void;
    isFullWidth: Function;
    openBillingPage: Function;
    openLinkPanel: (
      options: IOpenLinkPanelOptions,
      onSuccess: (linkData: ILinkType) => void,
      onCancel?: () => void,
    ) => void;
    openModal: Function;
    openDashboard: Function;
    refreshApp: Function;
    refreshAppByCompIds: Function;
    setFullWidth: Function;
    setHelpArticle: Function;
    triggerSettingsUpdatedEvent: Function;
  }

  interface IWixStyles {
    getColorByreference: (colorReference: string) => IWixColor | {};
    getSiteColors: (
      callback: (colors: Array<IWixSiteColor>) => void,
    ) => Array<IWixSiteColor>;
    getSiteTextPresets: (
      callback: (siteTextPresets: ISiteTextPreset) => void,
    ) => ISiteTextPreset;
    getStyleParams: (
      callback: (styles: IWixStyleParams) => void,
    ) => IWixStyleParams;
    getEditorFonts: Function;
    openColorPicker: Function;
    openFontPicker: Function;
    setBooleanParam: (
      key: string,
      value: { value: boolean },
      onSuccess?: Function,
      onError?: Function,
    ) => void;
    setColorParam: (
      key: string,
      value: { value: IWixColorParam },
      onSuccess?: Function,
      onError?: Function,
    ) => void;
    setFontParam: (
      key: string,
      value: { value: IWixStyleFont },
      onSuccess?: Function,
      onError?: Function,
    ) => void;
    setNumberParam: (
      key: string,
      value: { value: number },
      onSuccess?: Function,
      onError?: Function,
    ) => void;
    setStyleParams: (
      styleObjArr: Record<string, any>,
      onSuccess?: Function,
      onError?: Function,
    ) => void;
    getStyleId: (callback: (styleId: string) => void) => void;
  }

  interface IWixPubSub {
    publish: (eventName: string, data: any, isPersistent: boolean) => void;
    subscribe: (
      eventName: string,
      callback: (data: any) => void,
      receivePastEvents: boolean,
    ) => number;
    unsubscribe: (eventName: string, subscriptionId: number) => void;
  }

  interface IWixUtils {
    getCacheKiller: () => string;
    getCompId: () => string;
    getDeviceType: () => string;
    getInstanceId: () => string;
    getInstanceValue: (key: string) => string;
    getIpAndPort: () => string;
    getLocale: () => string;
    getOrigCompId: () => string;
    getPermissions: () => string;
    getSectionUrl: (
      sectionId?: { sectionId: string },
      callback?: (data: any) => void,
    ) => string | void;
    getSignDate: () => string;
    getSiteOwnerId: () => string;
    getTarget: () => string;
    getUid: () => string;
    getViewMode: () =>
      | 'standalone'
      | 'site'
      | 'editor'
      | 'preview'
      | 'onboarding'
      | 'dashboard';
    getWidth: () => string;
    navigateToSection: (
      options: INavigiateToSectionOptions,
      errorCB: Function,
    ) => void;
    toWixDate: (date: Date) => string;
    Media: IWixUtilsMedia;
    getSiteRevision: () => string;
  }

  interface IWixUtilsMedia {
    getAudioUrl: (relativeUrl: string) => string;
    getDocumentUrl: (relativeUrl: string) => string;
    getImageUrl: (relativeUrl: string) => string;
    getResizedImageUrl: (
      relativeUrl: string,
      width: number,
      height: number,
    ) => string;
    getSwfUrl: (relativeUrl: string) => string;
  }

  interface IWixDataPublic {
    get: (
      key: string,
      options: { scope: IPublicDataScope },
      onSuccess: (data: { [key: string]: any }) => void,
      onFailure: Function,
    ) => void;
    set: (
      key: string,
      value: any,
      options: { scope: IPublicDataScope },
      onSuccess: (data: { [key: string]: any }) => void,
      onFailure: Function,
    ) => void;
    remove: (
      key: string,
      options: { scope: IPublicDataScope },
      onSuccess: (removedKey: { [key: string]: any }) => void,
      onFailure: Function,
    ) => void;
    getAll: (
      onSuccess: (data: { [key: string]: any }) => void,
      onFailure: Function,
    ) => void;
  }

  interface IWixColor {
    value: string;
    reference: string;
  }

  interface IWixSiteColor extends IWixColor {
    name: string;
  }

  interface IWixColorParam {
    opacity: number;
    rgba: string;
    color: boolean | IWixSiteColor;
  }

  interface ISiteTextPreset {
    'Body-L'?: ITextPreset;
    'Body-M'?: ITextPreset;
    'Body-S'?: ITextPreset;
    'Body-XS'?: ITextPreset;
    'Heading-XL'?: ITextPreset;
    'Heading-L'?: ITextPreset;
    'Heading-M'?: ITextPreset;
    'Heading-S'?: ITextPreset;
    Menu?: ITextPreset;
    'Page-title'?: ITextPreset;
    Title?: ITextPreset;
  }

  interface ITextPreset {
    displayName?: string;
    editorKey: string;
    fontFamily: string;
    lineHeight: string;
    size: string;
    style: string;
    value: string;
    weight: string;
  }

  type IPublicDataScope = 'APP' | 'COMPONENT';

  type IWindowOrigin = 'FIXED' | 'ABSOLUTE' | 'DEFAULT' | 'RELATIVE';
  type IWindowPlacement =
    | 'TOP_LEFT'
    | 'TOP_CENTER'
    | 'TOP_RIGHT'
    | 'CENTER_LEFT'
    | 'CENTER'
    | 'CENTER_RIGHT'
    | 'BOTTOM_LEFT'
    | 'BOTTOM_CENTER'
    | 'BOTTOM_RIGHT';

  type IWixEvents =
    | 'EDIT_MODE_CHANGE'
    | 'PAGE_NAVIGATION_CHANGE'
    | 'SITE_PUBLISHED'
    | 'COMPONENT_DELETED'
    | 'SETTINGS_UPDATED'
    | 'WINDOW_PLACEMENT_CHANGED'
    | 'ON_MESSAGE_RESPONSE'
    | 'THEME_CHANGE'
    | 'STYLE_PARAMS_CHANGE'
    | 'SCROLL'
    | 'PAGE_NAVIGATION'
    | 'PAGE_NAVIGATION_IN'
    | 'PAGE_NAVIGATION_OUT'
    | 'STATE_CHANGED'
    | 'DEVICE_TYPE_CHANGED'
    | 'SITE_SAVED'
    | 'SESSION_CHANGED'
    | 'PUBLIC_DATA_CHANGED'
    | 'SITE_METADATA_CHANGED'
    | 'INSTANCE_CHANGED';

  interface IEditModeChangeData {
    editMode: 'editor' | 'preview';
  }

  type IWixTheme = 'BARE' | 'DEFAULT';

  type IWixFeatureType =
    | 'ADD_COMPONENT'
    | 'PREVIEW_TO_SETTINGS'
    | 'RESIZE_COMPONENT';

  interface IPopupPosition {
    origin: IWindowOrigin;
    placement?: IWindowPlacement;
  }

  interface IAnchor {
    id: string;
    title: string;
  }

  interface ISiteInfo {
    baseUrl: string;
    pageTitle: string;
    referrer: string;
    siteDescription: string;
    siteKeywords: string;
    siteTitle: string;
    url: string;
  }

  interface IMemberDetails {
    attributes?: IMemberAttributes;
    collectionId?: string;
    dateCreated?: string;
    dateUpdated?: string;
    email: string;
    id: string;
    name?: string;
    owner: boolean;
    status?: IMemberStatus;
  }

  interface IMemberAttributes {
    firstName: string;
    imageUrl: string;
    lastName: string;
    name: string;
  }

  interface IGetBoundingRectAndOffsets {
    offsets: {
      x: number;
      y: number;
    };
    rect: {
      width: number | string;
      height: number;
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    scale: number;
  }

  interface IGetComponentInfo {
    compId: string;
    pageId: string;
    showOnAllPages: boolean;
    tpaWidgetId: string;
    appPageId: string;
  }

  interface PixelEventType {
    eventName: string;
    parameters: Array<string>;
    requiredParameters: Array<string>;
  }

  interface IPageLink {
    type: 'PageLink';
    pageId: string;
  }

  interface IAnchorLink {
    type: 'AnchorLink';
    anchorName: string;
    anchorDataId: string;
    pageId: string;
  }

  interface IExternalLink {
    type: 'ExternalLink';
    url: string;
    target: '_blank' | '_top' | '_self' | '_parent';
  }

  interface IEmailLink {
    type: 'EmailLink';
    recipient: string;
    subject?: string;
  }

  interface IPhoneLink {
    type: 'PhoneLink';
    phoneNumber: string;
  }

  interface IDocumentLink {
    type: 'DocumentLink';
    docId: string;
    name: string;
    url: string;
  }

  interface IDynamicPageLink {
    type: 'DynamicPageLink';
    routerId: string;
    innerRoute: string;
  }

  interface IMenuHeaderLink {
    type: 'MenuHeader';
    subPages: Array<IPageLink>;
  }

  type ILinkType =
    | IPageLink
    | IAnchorLink
    | IExternalLink
    | IEmailLink
    | IPhoneLink
    | IDocumentLink
    | IMenuHeaderLink
    | IDynamicPageLink;

  type IMemberStatus = 'ACTIVE';

  interface IOpenLinkPanelOptions {
    link: ILinkType;
  }

  interface ISiteMapPageLink {
    hidden: boolean;
    isHomePage: boolean;
    pageId: string;
    title: string;
    type: 'PageLink';
    url: string;
    subPages?: Array<ISiteMapPageLink>;
  }

  interface IAppFields {
    platform: object;
  }

  interface IIsAppSectionInstalledOptions {
    appDefinitionId?: string;
  }

  interface IWixStyleParams {
    numbers: { [key: string]: number };
    booleans: { [key: string]: boolean };
    colors?: { [key: string]: IWixStyleColor };
    fonts?: { [s: string]: IWixStyleFont };
    googleFontsCssUrl: string;
  }

  interface IWixStyleColor {
    value: string;
    themeName?: string;
  }

  interface IWixStyleFont {
    cssFontFamily?: string;
    family?: string;
    fontStyleParam: boolean;
    preset?: string;
    size?: number;
    style?: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
    };
    value: string;
  }

  export type ITrackEventName =
    | 'ViewContent'
    | 'AddToCart'
    | 'InitiateCheckout'
    | 'ClickProduct'
    | 'RemoveFromCart'
    | 'AddPaymentInfo'
    | 'Purchase'
    | 'Lead'
    | 'CustomEvent'
    | 'AddProductImpression';

  export interface ITrackEventParams {
    appDefId?: string;
    id?: string | number;
    origin?: string;
    sku?: string;
    name?: string;
    price?: string | number;
    currency?: string;
    type?: string;
    category?: string;
    brand?: string;
    variant?: string;
    list?: string;
    position?: number;
    content_ids?: [string | number];
    contents?: any;
    num_items?: number;
    option?: string;
    affiliation?: string;
    revenue?: string | number;
    tax?: string | number;
    shipping?: string | number;
    coupon?: string;
    quantity?: number;
  }

  export interface INavigiateToSectionOptions {
    sectionId: string;
    state: string;
    queryParams: Record<string, any>;
  }
}

export = Wix;
