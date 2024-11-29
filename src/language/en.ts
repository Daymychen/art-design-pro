// src/i18n/en.ts
export default {
  topBar: {
    search: {
      title: 'Search'
    },
    user: ['User center', 'Document', 'Github', 'Log out']
  },
  common: {
    tips: 'Prompt',
    cancel: 'Cancel',
    confirm: 'Confirm',
    logOutTips: 'Do you want to log out?'
  },
  search: {
    placeholder: 'Search page',
    historyTitle: 'Search history',
    switchKeydown: 'Navigate',
    selectKeydown: 'Select'
  },
  setting: {
    menuType: {
      title: 'Menu Layout',
      list: ['Vertical', 'Horizontal', 'Mixed']
    },
    theme: {
      title: 'Theme Style',
      list: ['Light', 'Dark', 'System']
    },
    menu: {
      title: 'Menu Style'
    },
    color: {
      title: 'Theme Color'
    },
    box: {
      title: 'Box Style',
      list: ['Border', 'Shadow']
    },
    basics: {
      title: 'Basic Config',
      list: [
        'Sidebar opens accordion',
        'Show sidebar button',
        'Show reload page button',
        'Show crumb navigation',
        'Show work tab',
        'Show multilingual selection',
        'Show top progress bar',
        'Color Weakness Mode',
        'Auto close settings center',
        'Page animation'
      ]
    }
  },
  notice: {
    title: 'Notice',
    btnRead: 'Mark as read',
    bar: ['Notice', 'Message', 'Todo'],
    text: ['No']
  },
  worktab: {
    btn: ['Close left', 'Close right', 'Close outher', 'Close All'],
    tips: ['Slide up and down to move the tab position']
  },
  console: {
    card: [
      'Total visits',
      'Number of online visitors',
      'Visits',
      'Number of articles',
      'Number of messages',
      'To do task'
    ],
    histogram: {
      title: 'Visits'
    },
    plan: {
      title: 'Plan'
    },
    lingChart: {
      title: 'Traffic trend'
    },
    todo: {
      title: 'To do task'
    },
    pieChart: {
      title: 'Classified statistics'
    }
  },
  login: {
    title: 'Welcome back',
    subTitle: 'Please enter your account and password to login',
    placeholder: [
      'Please enter your account',
      'Please enter your password',
      'Please slide to verify'
    ],
    sliderText: 'Please slide to verify',
    sliderSuccessText: 'Verification successful',
    rememberPwd: 'Remember password',
    forgetPwd: 'Forget password',
    btnText: 'Login',
    noAccount: 'No account yet?',
    register: 'Register'
  },
  forgetPassword: {
    title: 'Forget password?',
    subTitle: 'Enter your email to reset your password',
    placeholder: 'Please enter your email',
    submitBtnText: 'Submit',
    backBtnText: 'Back'
  },
  register: {
    title: 'Create account',
    subTitle:
      'Welcome to join us, please fill in the following information to complete the registration',
    placeholder: [
      'Please enter your account',
      'Please enter your password',
      'Please enter your password again'
    ],
    rule: [
      'Please enter your password again',
      'The two passwords are inconsistent!',
      'The length is 3 to 20 characters',
      'The password length cannot be less than 6 digits',
      'Please agree to the privacy policy'
    ],
    agreeText: 'I agree',
    privacyPolicy: 'Privacy policy',
    submitBtnText: 'Register',
    hasAccount: 'Already have an account?',
    toLogin: 'To login'
  },
  lockScreen: {
    pwdError: 'Password error',
    lock: {
      inputPlaceholder: 'Please input lock screen password',
      btnText: 'Lock'
    },
    unlock: {
      inputPlaceholder: 'Please input unlock password',
      btnText: 'Unlock',
      backBtnText: 'Back to login'
    }
  }
}
