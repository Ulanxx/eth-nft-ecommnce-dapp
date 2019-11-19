import {ErrorStatusCode} from '../common/utils'

/**
 * This is a simple business logic demo, it simply simulates the following situation:
 * 1. business logic level exception raised.
 * 2. unexpected system level exception raised
 * 3. business logic goes OK, do the persistence jobs
 * 4. finally return the logic processing result.
 * @param p1
 * @param p2
 * @returns {Promise<string>}
 */
async function demo_logic(p1, p2) {
  if (p1 === 'Error'){
    throw new ErrorStatusCode(400, 10001, 'Explicitly error trigger')
  }
  if (p1 === 'Disas'){
    throw new Error('Unexpected disaster occurred.')
  }

  let new_value = await global.redis.incrAsync('TEST_DEMO_KEY')

  const ModelDemo = global.db.demo
  const document = new ModelDemo({TEST_DEMO_KEY: new_value})
  await document.save()

  return 'This is a demo'
}

export default demo_logic