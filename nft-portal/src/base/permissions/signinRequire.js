import userStore from '../userStore'


export default function signinRequired() {
  return userStore.fetch().then(
    role => {
      if (role !== 'BRAND') {
        return Promise.reject({
          redirect: '/signin',
        })
      }
    },
    () => {
      return Promise.reject({
        redirect: '/signin',
      })
    }
  )
}


