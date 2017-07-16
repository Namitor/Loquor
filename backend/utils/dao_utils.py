# coding=utf-8

"""
Created by jayvee on 2017/6/9.
https://github.com/JayveeHe
"""
import json
import os

import sys

import datetime
from flask.ext.sqlalchemy import SQLAlchemy

abs_path = os.path.dirname(os.path.abspath(__file__))
abs_father_path = os.path.dirname(abs_path)
PROJECT_PATH = abs_father_path
print 'Used file: %s\nProject path=%s' % (__file__, PROJECT_PATH)
sys.path.append(PROJECT_PATH)
# add flask path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(PROJECT_PATH, 'loquor.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(PROJECT_PATH, 'datas')

db = SQLAlchemy()


class Comment(db.Model):
    loquor_id = db.Column(db.String(128), unique=True)
    comment_id = db.Column(db.Integer, primary_key=True)
    page_id = db.Column(db.Integer, unique=True)
    user_name = db.Column(db.String(20))
    content = db.Column(db.Text)
    post_time = db.Column(db.DateTime)
    extra_info = db.Column(db.String(40))

    def __init__(self, loquor_id, comment_id, page_id, user_name, content, post_time=None, extra_info=None):
        self.loquor_id = loquor_id
        self.comment_id = comment_id
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


class DBManager():
    def __init__(self, db_inst):
        pass


if __name__ == '__main__':
    # db.create_all()
    # new_comment = Comment('111', 2, 3, 'asdfasdf', 'gwerqe')
    # db.session.add(new_comment)
    # db.session.commit()
    find_res = Comment.query.filter_by().all()
    print find_res
    pass
