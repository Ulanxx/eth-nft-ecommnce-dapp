import userStore from '../userStore'


export default function enduserRequired() {
  return userStore.fetch().then(
    role => {
      if (role !== 'ENDUSER') {
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


