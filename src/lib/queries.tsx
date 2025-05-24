import { gql } from "@apollo/client";

export const GET_HEADER_DATA = gql`
  query getHeaderData($locale: I18NLocaleCode) {
    header(locale: $locale) {
      data {
        attributes {
          trade_show
          about
          calendar
          contact
          project
          service {
            list {
              name
              link
            }
            title
            link
          }
          CallNow {
            lable
            phone
          }
        }
      }
    }
  }
`;

export const GET_FOOTER_DATA = gql`
  query getFooterData($locale: I18NLocaleCode) {
    footer(locale: $locale) {
      data {
        attributes {
          address
          email
          mobile_number
          footerA {
            title
            subList {
              name
              link
            }
          }
          footerS {
            title
            subList {
              name
              link
            }
          }
          footerP {
            title
            subList {
              name
              link
            }
          }
          footerCty {
            title
            subList {
              name
              link
            }
          }
          terms
          privacy
          social {
            icon
            link
          }
        }
      }
    }
  }
`;

export const GET_PARTNER_DATA = gql`
  query getPartner($locale: I18NLocaleCode) {
    ourPartner(locale: $locale) {
      data {
        attributes {
          title
          patner {
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            name
            link
            country
          }
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_DATA = gql`
  query getHomePageData($locale: I18NLocaleCode) {
    homePages(locale: $locale) {
      data {
        attributes {
          herosec {
            hereSlide {
              title
              subTitle
              btnLink
              btnLabel
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              mobileImg {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              listNum1
              listNum2
              listNum3
              listLabel1
              listLabel2
              listLabel3
            }
            event {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              name
              date
            }
          }
          SecndSec {
            title
            description
            slideUpImgs {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            slideDownImgs {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            Card {
              icon {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              number
              label
            }
          }
          HomeSec2 {
            title
            subTitle
            description
          }
          HomeSec3 {
            title
            description
            description2
            image1 {
              data {
                attributes {
                  url
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                }
              }
            }
            ExhiList {
              lable
            }
          }
          HomeTeam {
            title
            link
            linkLabel
            leaderMembr {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              name
              email
              position
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_RESOURCE_DATA = gql`
  query getResource($locale: I18NLocaleCode) {
    resource(locale: $locale) {
      data {
        attributes {
          mainTitle
          description
          btnLink
          btnLabel
          resourceCrd {
            title
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            link
          }
        }
      }
    }
  }
`;

export const GET_REVIEW = gql`
  query getReview($locale: I18NLocaleCode) {
    review(locale: $locale) {
      data {
        attributes {
          title
          review {
            logo {
              data {
                attributes {
                  url
                }
              }
            }
            authorImg {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            aboutAuthor
            authorName
            decription
            rating
          }
        }
      }
    }
  }
`;

export const GET_EXHIBITION_DATA = gql`
  query getExhibition($locale: I18NLocaleCode) {
    event(locale: $locale) {
      data {
        attributes {
          title
          subLabel
          exhibitionCrd {
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            link
            btnLabel
            description
            label
            evntCatgry {
              name
            }
          }
        }
      }
    }
  }
`;

//Project Page
export const GET_PROJECT_CATEGORY = gql`
  query getProjectCategories($locale: I18NLocaleCode) {
    projectCategories(locale: $locale) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query getProjects($locale: I18NLocaleCode, $slug: String) {
    projects(locale: $locale, filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          name
          slug
          featuredImg {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          description
          project_category {
            data {
              attributes {
                name
              }
            }
          }
          projOverview {
            title
            description
            details {
              label
              answer
            }
          }
          gallerySec {
            title
            description
            images {
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
            }
          }
          featurePrjSec {
            title
            btnLink
            btnLabel
            subTitle
          }
          bannerSec {
            title
            description
            bgImg {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          is_featured
          label {
            name
          }
        }
      }
    }
  }
`;

export const GET_PROJECT_PAGE = gql`
  query getProjectPages($locale: I18NLocaleCode) {
    projectPages(locale: $locale) {
      data {
        attributes {
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          SecondSec {
            title
            subTitle
            description
            number {
              Number
              label
            }
            image1 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          BannerSec {
            title
            description
            bgImg {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          GallarySec {
            title
            description
            images {
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

export const GET_FEATURED_PROJECT_SEC = gql`
  query getProjectSec($locale: I18NLocaleCode) {
    projectSec(locale: $locale) {
      data {
        attributes {
          title
          subTitle
          btnLabel
          btnLink
        }
      }
    }
  }
`;

export const GET_CLIENT_DATA = gql`
  query getClient($locale: I18NLocaleCode) {
    partner(locale: $locale) {
      data {
        attributes {
          title
          client(pagination: { limit: -1 }) {
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            name
          }
        }
      }
    }
  }
`;

export const GET_CONTACT_DATA = gql`
  query getContact($locale: I18NLocaleCode) {
    contactSec(locale: $locale) {
      data {
        attributes {
          bgImage {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          mainTitle
          subTitle
          messageLbl
          nameLbl
          emailLbl
          compnyNameLbl
          contactLbl
          btnlabel
        }
      }
    }
  }
`;

// About Page
export const GET_ABOUT_DATA = gql`
  query getAboutPage($locale: I18NLocaleCode) {
    aboutPages(locale: $locale) {
      data {
        attributes {          
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          SecImage2 {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          CounterSec {
            listCount {
              count
              label
            }
          }
          missionSec {
            missionCard {
              title
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              icon {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              description
            }
            title
            sub_description
            main_description
            VissionCard {
              title
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              icon {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              description
            }
          }
          serviceSec {
            title
            description
            serviceCrd {
              name
              description
            }
          }          
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

//Contact Page
export const GET_CONTACT_PAGE_DATA = gql`
  query getContactPages($locale: I18NLocaleCode) {
    contactPages(locale: $locale) {
      data {
        attributes {
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          FormSec {
            title
            description
            sub_description
            btnLabel
            form {
              nameLabel
              namePlaceholder
              emailLabel
              emailPlaceholder
              phoneLabel
              phonePlaceholder
              budgetLabel
              budgetPlaceholder
              messageLabel
              messagePlaceholder
              btnLabel
            }
          }
          InfoSec {
            title
            description
            address {
              country
              address
              phoneLabel
              phoneNumber
              phoneNumber2
              phone1Country
              phone2Country
              emailLabel
              email
              link
            }
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            headquarter {
              headquaterLbl
              address
              phoneLbl
              phoneNum
              emailLbl
              email
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

//Exhibition Page
export const GET_EXHIBITION_PAGE_DATA = gql`
  query getExhibitionData($locale: I18NLocaleCode) {
    exhibitionPages(locale: $locale) {
      data {
        attributes {
          HeadSec {
            heading
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            breadcrumb {
              SubHead1
              link1
              SubHead2
              link2
            }
          }

          ExhiSec {
            title
            description
            description2
            ExhiList {
              lable
            }
            image1 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }

          services {
            title
            description
            image01 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            label01
            link1
            image02 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            label02
            link2
            image03 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            label03
            link3
          }

          faqSec {
            faqList {
              question
              answers
            }
          }

          banner1 {
            data {
              attributes {
                url
              }
            }
          }
          banner2 {
            data {
              attributes {
                url
              }
            }
          }
          banner3 {
            data {
              attributes {
                url
              }
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_DESIGNRESULT_DATA = gql`
  query getDesignResult($locale: I18NLocaleCode) {
    designResult(locale: $locale) {
      data {
        attributes {
          subTitle
          mainTitle
          description
          step {
            title
            subTitle
            description
            step
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            designImg {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
        }
      }
    }
  }
`;


//PortFolio Page
export const GET_PORTFOLIO_PAGE = gql`
  query getPortfolioPages($locale: I18NLocaleCode) {
    portfolioPages(locale: $locale) {
      data {
        attributes {
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          StandSec {
            title

            description
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_PORTFOLIO_CATEGORY = gql`
  query getPortfolioCatgries($locale: I18NLocaleCode) {
    portfolioCatgries(locale: $locale) {
      data {
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_PORTFOLIO_IMAGES = gql`
  query getPortfolioImgs($locale: I18NLocaleCode) {
    portfolioImgs(locale: $locale, pagination: { limit: 1000 }) {
      data {
        attributes {
          image {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          portfolio_catgry {
            data {
              attributes {
                name
              }
            }
          }
          SubImgs {
            images {
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
            }
          }
          name
          description
        }
      }
    }
  }
`;

//Event Production PAge
export const GET_EVENT_PRODUCTION_DATA = gql`
  query getEventProduction($locale: I18NLocaleCode) {
    eventProductionPages(locale: $locale) {
      data {
        attributes {
          EventSections {
            HeadTitleLink
            SubTitle
            SubDesc
            HeadDesc
            HeadTitle
            SectionImg {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          SecndSec {
            title
            description
            rightImg {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

//Calendar page
export const GET_CALENDER = gql`
  query getCalenders($locale: I18NLocaleCode) {
    calenders(locale: $locale) {
      data {
        id
        attributes {
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          eventCrd(pagination: { limit: 100 }) {
            name
            startDate
            endDate
            eventLogo {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            eventLocation
            event_category {
              data {
                attributes {
                  name
                }
              }
            }
            is_popular
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_CALENDAR = gql`
  query getAllCalendars($locale: I18NLocaleCode) {
    calenDetails(locale: $locale, pagination: { limit: -1 }) {
      data {
        attributes {
          slug
          CalenCrd {
            logo {
              data {
                attributes {
                  url
                }
              }
            }
            title
            startDate
            endDate
            location
            rating
            map
            category
            Lebel {
              name
            }
            Featured
            is_popular
          }
        }
      }
    }
  }
`;

export const GET_CALENDAR_DETAIL = gql`
  query getCalendarDetails($locale: I18NLocaleCode, $slug: String) {
    calenDetails(locale: $locale, filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          slug
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                }
              }
            }
          }
          CalenCrd {
            logo {
              data {
                attributes {
                  url
                }
              }
            }
            title
            startDate
            endDate
            location
            rating
            map
            category
            Lebel {
              name
            }
            Featured
          }
          description
          topic
          Highlight {
            lists {
              text
            }
            HighLable {
              name
            }
          }
          Listed {
            name
          }
        }
      }
    }
  }
`;

//Exhibition Contactoer Page
export const GET_EXHIBITION_CONSTROCTOR_DATA = gql`
  query getExhibitionConstroctorData($locale: I18NLocaleCode) {
    constroctor(locale: $locale) {
      data {
        attributes {
          topic
          subTopic
          description
          Conhead {
            heading
            image {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            breadcrumb {
              SubHead1
              link1
              SubHead2
              link2
            }
          }

          ConSec {
            heading
            subheading
            description
            image1 {
              data {
                attributes {
                  url
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                }
              }
            }
          }

          accordion {
            FaqTitle
            ConFaq {
              question
              answers
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }         
    }
  }
`;

//Exhibition Stand Designer
export const GET_EXHIBITION_DESIGN_DATA = gql`
  query getExhibitionDesignData($locale: I18NLocaleCode) {
    exhiDesPage(locale: $locale) {
      data {
        attributes {
          DesHead {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            heading
            breadcrumb {
              SubHead1
              link1
              SubHead2
              link2
            }
          }
          DesSec2 {
            title
            subText
            description
            image1 {
              data {
                attributes {
                  url
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                }
              }
            }
          }
          DescribsSec {
            title
            subTitle
            description
          }
          DesFaq {
            FaqTitle
            ConFaq {
              question
              answers
            }
          }
          SecPortfolio {
            title
            SubTitle
            image1 {
              data {
                attributes {
                  url
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                }
              }
            }
            button {
              label
              link
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                }
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

//Exhibition Branding page 
export const GET_EXHIBITION_BRANDING_DATA = gql`
  query getExhibitionBrandingData($locale: I18NLocaleCode) {
    exhiBranPage(locale: $locale) {
      data {
        attributes {
          BranHead {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            heading
            breadcrumb {
              SubHead1
              link1
              SubHead2
              link2
            }
          }
          BranDescribe {
            title
            subTitle
            description
          }
          BrandSec2 {
            title
            description
            description2
            image1 {
              data {
                attributes {
                  url
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                }
              }
            }
            ExhiList {
              lable
            }
          }
          banner1 {
            data {
              attributes {
                url
              }
            }
          }
          banner2 {
            data {
              attributes {
                url
              }
            }
          }
          banner3 {
            data {
              attributes {
                url
              }
            }
          }
          BrandFaq {
            FaqTitle
            ConFaq {
              question
              answers
            }
          }  
        }
      }
    }
  }
`;

//Wedding Page
export const GET_WEDDING_DATA = gql`
  query GetWeddingData($locale: I18NLocaleCode) {
    weddingPages(locale: $locale) {
      data {
        attributes {
          Header {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            heading
            breadcrumb {
              SubHead1
              link1
              SubHead2
              link2
            }
          }
          WeddingSec2 {
            Heading
            SubHeading
            WedSlider {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
            NumberBox {
              count
              label
            }
          }
          WeddingSec3 {
            Heading
            SubHeading
            Slider {
              title
              Subtitle
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
          WeddingPort {
            heading
            SubHeading
            InterGallery {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
            BtnLabel
          }
          WeddingFaq {
            FaqTitle
            ConFaq {
              question
              answers
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                } 
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
            keywords
            metaRobots
            structuredData
            metaViewport
            canonicalURL
          }
        }
      }
    }
  }
`;

//Services Page
export const GET_SERVICE_DATA = gql`
  query getServicePages($locale: I18NLocaleCode) {
    servicePages(locale: $locale) {
      data {
        id
        attributes {
          SecndSec {
            title
            description
            slideUpImgs {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            slideDownImgs {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            Card {
              icon {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
              label
              number
            }
          }
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          OfferSec {
            title
            clintOfferCat {
              name
              link
            }
            main_description
            sub_description
            offerList {
              name
            }
            image1 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          banner1 {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          banner2 {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          banner3 {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
          faqSec {
            faqList {
              question
              answers
            }
          }
        }
      }
    }
  }
`;


//Stand Pages
export const GET_STAND_DETAIL = gql`
  query getStandDetails($locale: I18NLocaleCode, $slug: String) {
    standDetails(locale: $locale, filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          slug
          HeroSec {
            title
            bgImage {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
          }
          SecondSec {
            title
            description
            description2
            image1 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image2 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image3 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            image4 {
              data {
                attributes {
                  url
                  alternativeText
                }
              }
            }
            ExhiList {
              lable
            }
          }

          faqSec {
            faqList {
              question
              answers
            }
          }
          ImgSec {
            img {
              image {
                data {
                  attributes {
                    url
                    alternativeText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

//Trade Show Page
export const GET_TRADESHOW_DATA = gql`
  query GetTradeShowData($locale: I18NLocaleCode) {
    tradeShows(locale: $locale) {
      data {
        attributes {
          TradeHead {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            heading
            breadcrumb {
              SubHead1
              link1
              SubHead2
              link2
            }
          }
          TradeShowSec2 {
            Heading
            TradeCard {
              Image {
                data {
                  attributes {
                    url
                  }
                }
              }
              label
            }
          }
          Heading
          description1
          Image {
            data {
              attributes {
                url
              }
            }
          }
          heading2
          description2
          Banner {
            data {
              attributes {
                url
              }
            }
          }
          TradeProcess {
            title
            subtitle
            description
            Processlist {
              Image {
                data {
                  attributes {
                    url
                  }
                }
              }
              label
            }
          }
          TradePort {
            heading
            SubHeading
            InterGallery {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
            BtnLabel
          }
          BannerCard {
            lable1
            lable2
            button {
              link
              label
            }
          }
          TradeFaq {
            FaqTitle
            ConFaq {
              question
              answers
            }
          }
          meta_data {
            metaTitle
            metaDescription
            metaImage {
              data {
                attributes {
                  url
                } 
              }
            }
            metaSocial {
              socialNetwork
              title
              description
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
            keywords
            metaRobots
            structuredData
            metaViewport
            canonicalURL
          }
        }
      }
    }
  }
`;