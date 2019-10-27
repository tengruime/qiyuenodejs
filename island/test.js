
function func1(){
    try {
        func2()
    } catch (error) {
        
    }
}

async function func2(){
    try {
        await func3()
    } catch (error) {
        console.log('error')
    }
}

function func3(){

    return new Promise((resolve, reject)=>{
        setTimeout(function(){
           const r = Math.random()
           if(r<0.5) {
                reject('error')
           } 
        }, 1000);
    })
    
}

func1()