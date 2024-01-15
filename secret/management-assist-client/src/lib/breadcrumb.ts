import type { Page } from '@sveltejs/kit'

type BreadcrumbConfig = {
  name?: string
  link?: string
  current?: boolean
}

const config: { [pathName: string]: BreadcrumbConfig } = {
  root: {
    name: 'ダッシュボード',
    link: '/'
  },
  customers: {
    name: '顧客',
    link: '/customers'
  },
  newCustomer: {
    name: '登録',
    link: '/customers/new'
  },
  lecturers: {
    name: '講師',
    link: '/lecturers'
  },
  newLecturer: {
    name: '登録',
    link: '/lecturer/new'
  },
  masterLecturerAffiliatedOrganizations: {
    name: '所属組織',
    link: '/master-lecturer-affiliated-organizations'
  },
  newMasterLecturerAffiliatedOrganization: {
    name: '登録',
    link: '/master-lecturer-affiliated-organizations/new'
  },
  lecturerFees: {
    name: '講師料',
    link: '/lecturer-fees'
  },
  seminars: {
    name: '研修',
    link: '/seminars'
  },
  masterSeminarDomains: {
    name: '研修分野',
    link: '/master-seminar-domains'
  },
  newMasterSeminarDomain: {
    name: '登録',
    link: '/master-seminar-domains/new'
  }
}

export const setBreadcrumbs = (
  page: Page,
  name?: string,
  secondName?: string
): BreadcrumbConfig[] => {
  switch (page.route.id) {
    case '/': {
      return [{ ...config.root, current: true }]
    }
    case '/customers': {
      return [config.root, { ...config.customers, current: true }]
    }
    case '/customers/new': {
      return [
        config.root,
        config.customers,
        { ...config.newCustomer, current: true }
      ]
    }
    case '/customers/[id=integer]': {
      return [
        config.root,
        config.customers,
        {
          name,
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/edit': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/contracts': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '契約',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/contracts/new': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '契約',
          link: `/customers/${page.params.id}/contracts`
        },
        {
          name: '登録',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/contracts/[secondId=integer]': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '契約',
          link: `/customers/${page.params.id}/contracts`
        },
        {
          name: secondName,
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/contracts/[secondId=integer]/edit': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '契約',
          link: `/customers/${page.params.id}/contracts`
        },
        {
          name: secondName,
          link: `/customers/${page.params.id}/contracts/${page.params.secondId}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/departments': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '部門',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/departments/new': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '部門',
          link: `/customers/${page.params.id}/departments`
        },
        {
          name: '登録',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/departments/[secondId=integer]': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '部門',
          link: `/customers/${page.params.id}/departments`
        },
        {
          name: secondName,
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/departments/[secondId=integer]/edit': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '部門',
          link: `/customers/${page.params.id}/departments`
        },
        {
          name: secondName,
          link: `/customers/${page.params.id}/departments/${page.params.secondId}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/training-classifications': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '研修分類',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/training-classifications/new': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '研修分類',
          link: `/customers/${page.params.id}/training-classifications`
        },
        {
          name: '登録',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/training-classifications/[secondId=integer]': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '研修分類',
          link: `/customers/${page.params.id}/training-classifications`
        },
        {
          name: secondName,
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/training-classifications/[secondId=integer]/edit': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '研修分類',
          link: `/customers/${page.params.id}/training-classifications`
        },
        {
          name: secondName,
          link: `/customers/${page.params.id}/training-classifications/${page.params.secondId}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/managers': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '担当者',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/managers/new': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '担当者',
          link: `/customers/${page.params.id}/managers`
        },
        {
          name: '登録',
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/managers/[secondId=integer]': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '担当者',
          link: `/customers/${page.params.id}/managers`
        },
        {
          name: secondName,
          current: true
        }
      ]
    }
    case '/customers/[id=integer]/managers/[secondId=integer]/edit': {
      return [
        config.root,
        config.customers,
        {
          name,
          link: `/customers/${page.params.id}`
        },
        {
          name: '担当者',
          link: `/customers/${page.params.id}/managers`
        },
        {
          name: secondName,
          link: `/customers/${page.params.id}/managers/${page.params.secondId}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/lecturers': {
      return [config.root, { ...config.lecturers, current: true }]
    }
    case '/lecturers/new': {
      return [
        config.root,
        config.lecturers,
        { ...config.newLecturer, current: true }
      ]
    }
    case '/lecturers/[id=integer]': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          current: true
        }
      ]
    }
    case '/lecturers/[id=integer]/edit': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          link: `/lecturers/${page.params.id}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/lecturers/[id=integer]/lecturer-contract': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          link: `/lecturers/${page.params.id}`
        },
        {
          name: '契約',
          current: true
        }
      ]
    }
    case '/lecturers/[id=integer]/lecturer-contract/new': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          link: `/lecturers/${page.params.id}`
        },
        {
          name: '契約',
          link: `/lecturers/${page.params.id}/lecturer-contract`
        },
        {
          name: '登録',
          current: true
        }
      ]
    }
    case '/lecturers/[id=integer]/lecturer-contract/edit': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          link: `/lecturers/${page.params.id}`
        },
        {
          name: '契約',
          link: `/lecturers/${page.params.id}/lecturer-contract`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/lecturers/[id=integer]/lecturer-fees': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          link: `/lecturers/${page.params.id}`
        },
        {
          name: '講師料',
          current: true
        }
      ]
    }
    case '/lecturers/[id=integer]/lecturer-fees/edit': {
      return [
        config.root,
        config.lecturers,
        {
          name,
          link: `/lecturers/${page.params.id}`
        },
        {
          name: '講師料',
          link: `/lecturers/${page.params.id}/lecturer-fees`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/master-lecturer-affiliated-organizations': {
      return [
        config.root,
        { ...config.masterLecturerAffiliatedOrganizations, current: true }
      ]
    }
    case '/master-lecturer-affiliated-organizations/new': {
      return [
        config.root,
        config.masterLecturerAffiliatedOrganizations,
        { ...config.newMasterLecturerAffiliatedOrganization, current: true }
      ]
    }
    case '/master-lecturer-affiliated-organizations/[id=integer]': {
      return [
        config.root,
        config.masterLecturerAffiliatedOrganizations,
        {
          name,
          current: true
        }
      ]
    }
    case '/master-lecturer-affiliated-organizations/[id=integer]/edit': {
      return [
        config.root,
        config.masterLecturerAffiliatedOrganizations,
        {
          name,
          link: `/master-lecturer-affiliated-organizations/${page.params.id}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    case '/lecturer-fees': {
      return [config.root, { ...config.lecturerFees, current: true }]
    }
    case '/seminars': {
      return [config.root, { ...config.seminars, current: true }]
    }
    case '/master-seminar-domains': {
      return [config.root, { ...config.masterSeminarDomains, current: true }]
    }
    case '/master-seminar-domains/new': {
      return [
        config.root,
        config.masterSeminarDomains,
        { ...config.newMasterSeminarDomain, current: true }
      ]
    }
    case '/master-seminar-domains/[id=integer]': {
      return [
        config.root,
        config.masterSeminarDomains,
        {
          name,
          current: true
        }
      ]
    }
    case '/master-seminar-domains/[id=integer]/edit': {
      return [
        config.root,
        config.masterSeminarDomains,
        {
          name,
          link: `/master-seminar-domains/${page.params.id}`
        },
        {
          name: '編集',
          current: true
        }
      ]
    }
    default: {
      return []
    }
  }
}
