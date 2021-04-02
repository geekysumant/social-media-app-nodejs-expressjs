const queue=require('../config/kue');
const comments_mailer=require('../mailers/comment_mailer');

queue.process('emails',(job,done)=>{
    console.log('emails worker processing a job',job.data); //job.data holds the comment

    comments_mailer.newComment(job.data);
    done();

})