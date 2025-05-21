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