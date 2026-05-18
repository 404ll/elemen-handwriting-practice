const { reject } = require("lodash");

function creatTaskRunner(options){
     const { maxRetries = 0, timeout = 0, retryDelay = 0 } = options;

    if (maxRetries < 0 || timeout < 0 || retryDelay < 0) {
        throw new Error('Invalid options');
    }

    //延迟逻辑
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    async function executeTaak(task, index){
        let attempt = 0

        //少于最大重试次数
        while(attempt <= maxRetries){
            try{
                //先执行任务，无超时就直接返回；有超时再与超时 Promise 赛跑
                const taskPromise = task()
                
                if (timeout <= 0) {
                    return await taskPromise
                }

                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout')), timeout)
                })

                return await Promise.race([taskPromise, timeoutPromise])
            }catch(err){
                attempt++

                if(attempt > maxRetries){
                    throw new Error(`Task ${index} failed after ${maxRetries} retries: ${err.message}`);
                }

                if(retryDelay > 0){
                    await sleep(retryDelay)
                }
            }
        }
    }

    return async function run(tasks) {
        const results = []
        for(let i = 0; i < tasks.length; i++){
            const result = await executeTaak(tasks[i], i)
            result.push(result)
        }
        return results
    }    
}