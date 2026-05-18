const { reject, forEach } = require("lodash")

function flat(obj){
    let res = {}

    function dfs(cur, path){
        //如果是基础类型 直接返回
        if (typeof cur !== 'object' || cur === null) {
            res[path] = cur
            return
        }

        //数组
        if(Array.isArray(cur)){
            cur.forEach((item,index) =>{
                dfs(item, `${path}[${index}]`)
            })
            return
        }

        //对象
        for(const key in cur){
            const newpath = path ?  `${path}.${key}` : key
            dfs(cur[key], newpath)
        }
    }

    dfs(obj, "")
    return res
}


console.log(flat({ x: [1, { y: [2, 3] }], z: null }))//{ "x[0]": 1, "x[1].y[0]": 2, "x[1].y[1]": 3, "z": null }


function myPromise(iterable){
    const tasks = Array.from(iterable)
    let count = 0

    return new Promise((resolve, reject)=>{

        tasks.forEach((task, idx) => {
            Promise.resolve(task).then(()=>{
                
                //成功的逻辑
                count++

            },
            
        )
        .catch(err=>{
                //失败的逻辑
        })
        })
    })
}