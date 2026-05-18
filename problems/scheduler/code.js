// 题目：实现一个带并发控制的异步调度器                                                                                                                                                           
                                                                                                                                                                                                 
// // 要求：                                                                                                                                                                                      
// // 1. 同时最多执行 2 个异步任务                                                                                                                                                                
// // 2. 任务完成后自动从队列取出下一个执行                                                                                                                                                       
// // 3. 支持 add 方法，返回 Promise，任务完成后 resolve                                                                                                                                          
                                                                                                                                                                                               
// const scheduler = new Scheduler(2);                                                                                                                                                            
                                                                                                                                                                                               
// scheduler.add(() => fetch('/api/1')); // 立即执行                                                                                                                                              
// scheduler.add(() => fetch('/api/2')); // 立即执行                                                                                                                                            
// scheduler.add(() => fetch('/api/3')); // 排队，等上面某个完成   

class Scheduler{
    constructor(num){
        this.limit = num
        this.running = 0
        this.queue = []
    }

    async add(fn){
       return new Promise((resolve,reject) => {
            const runTask = () => {
                this.running++

                Promise.resolve().then(fn).then(resolve).catch(reject).finally(()=>{
                    this.running--
                    this.runNext()
                })
            }
            
             if (this.running < this.limit) {                                                                                                                                                   
                  runTask();              // 有槽位，立即执行                                                                                                                                  
              } else {                                                                                                                                                                           
                  this.queue.push(runTask); // 无槽位，排队                                                                                                                                      
              }                                                                                                                                                                                  
          });                       
    }

    runNext() {                                                                                                                                                                                
          while (this.queue.length > 0 && this.running < this.limit) {                                                                                                                            
              const task = this.queue.shift();                                                                                                                                                   
              task();                                                                                                                                                                            
          }                                                                                                                                                                                      
      }  
    
}

                                                                                                                                                                                                 
  const scheduler = new Scheduler(2);

  const delay = (ms) => () => new Promise(resolve => setTimeout(resolve, ms));

  const start = Date.now();

  scheduler.add(delay(1000)).then(() => console.log('task 1 done', Date.now() - start));
  scheduler.add(delay(2000)).then(() => console.log('task 2 done', Date.now() - start));
  scheduler.add(delay(300)).then(() => console.log('task 4 done', Date.now() - start));

