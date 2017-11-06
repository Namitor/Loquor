# coding=utf-8

"""
Created by jayvee on 2017/6/9.
https://github.com/JayveeHe
"""
import datetime
import json
import os

import sys
from flask import Flask
from flask import make_response
from flask import request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

abs_path = os.path.dirname(os.path.abspath(__file__))
abs_father_path = os.path.dirname(abs_path)
PROJECT_PATH = abs_father_path
print 'Used file: %s\nProject path=%s' % (__file__, PROJECT_PATH)
sys.path.append(PROJECT_PATH)
# add flask path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(PROJECT_PATH, 'datas', 'loquor.db')

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(PROJECT_PATH, 'loquor.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(PROJECT_PATH, 'datas')

db = SQLAlchemy(app)

CORS(app)


@app.before_first_request
def init_server():
    db.create_all()


class Comment(db.Model):
    loquor_id = db.Column(db.String(32))
    comment_id = db.Column(db.Integer, primary_key=True)
    page_id = db.Column(db.String(32))
    user_name = db.Column(db.String(20))
    content = db.Column(db.Text)
    post_time = db.Column(db.DateTime)
    extra_info = db.Column(db.String(40))

    def __init__(self, loquor_id, page_id, user_name, content, comment_id=None, post_time=None, extra_info=None):
        self.loquor_id = loquor_id
        if comment_id:
            self.comment_id = comment_id
        else:
            self.comment_id = len(Comment.query.all())
        self.page_id = page_id
        self.user_name = user_name
        self.content = content
        self.extra_info = extra_info if extra_info else 'None'
        if post_time:
            self.post_time = post_time
        else:
            self.post_time = datetime.datetime.now()

    def __repr__(self):
        jsonobj = {'loquor_id': self.loquor_id, 'comment_id': self.comment_id, 'page_id': self.page_id,
                   'user_name': self.user_name, 'content': self.content, 'extra_info': self.extra_info,
                   'post_time': self.post_time.strftime('%Y-%m-%d %H:%M:%S')}
        return json.dumps(jsonobj)
        # return 'loquor_id=%s\tcomment_id=%s\tpage_id=%s\tuser_name=%s\tcontent=%s\tpost_time=%s' % (
        #     self.loquor_id, self.comment_id, self.page_id, self.user_name, self.content, self.post_time)


@app.route('/loquor/comment', methods=['POST'])
def create_comment():
    """
    插入评论
    Args:

    Returns:

    """
    try:
        print 'receive post from %s, req data= %s' % (request.remote_addr, request.data)
        req_data_obj = json.loads(request.data)
        loquor_id = req_data_obj['loquor_id']
        comment_id = req_data_obj.get('comment_id', None)
        extra_info = req_data_obj.get('extra_info', None)
        page_id = req_data_obj['page_id']
        user_name = req_data_obj['user_name']
        content = req_data_obj['content']
        tmp_comment = Comment(loquor_id, page_id, user_name, content, comment_id, extra_info=extra_info)
        db.session.add(tmp_comment)
        db.session.commit()
        # post_time = db.Column(db.DateTime)
        result = {'code': 200, 'result': json.loads(str(tmp_comment))}
        resp = make_response(json.dumps(result, ensure_ascii=False), 200)
    except Exception, e:
        res = {'code': 400, 'error_msg': e.message}
        resp = make_response(json.dumps(res, ensure_ascii=False), 200)
    resp.mimetype = 'application/json'
    return resp


@app.route('/loquor/comment', methods=['GET'])
def get_comments():
    try:
        loquor_id = request.args.get('loquor_id')
        page_id = request.args.get('page_id')
        query_res = Comment.query.filter_by(loquor_id=loquor_id, page_id=page_id).order_by(Comment.post_time).all()
        query_res.reverse()
        result = {'code': 200, 'result': json.loads(str(query_res))}
        resp = make_response(json.dumps(result, ensure_ascii=False), 200)
    except Exception, e:
        res = {'code': 400, 'error_msg': e.message}
        resp = make_response(json.dumps(res, ensure_ascii=False), 200)
    resp.mimetype = 'application/json'
    return resp


if __name__ == '__main__':
    app.run('0.0.0.0', port=6147, debug=False)
    # new_comment = Comment('111', 2, 'asdfasdf', 'gwerqe')
    # db.session.add(new_comment)
    # db.session.commit()
    # find_res = Comment.query.filter_by().all()
    # print find_res
    pass
