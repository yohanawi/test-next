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