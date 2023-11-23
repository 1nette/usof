import React from 'react';
import CommentsItem from './CommentsItem';

const CommentsList = ({ commentsArray, token }) => {
    if (commentsArray.length !== 0) {
        return (
            <div>
                {commentsArray.map(comment =>
                    <CommentsItem comment={comment} key={comment.id} token={token} />
                )}
            </div>
        )
    }
    else {
        return (
            <div className='comments_list_none'>
                No comments yet
            </div>
        )
    }
}

export default CommentsList;