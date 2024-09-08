import request from './request'

// 获取人员列表（分页）
export const getUsers = async (params) => {
    const response = await request({
        url: '/personnel',
        method: 'GET',
        params
    })
    if (!response.ok) {
        throw new Error('获取失败，服务器返回错误状态');
    } else {
        return await response.json();
    }
}

// 添加新人员
export const addUser = async (data) => {
    const response = await request({
        url: '/personnel',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    if (!response.ok) {
        throw new Error('添加失败，服务器返回错误状态');
    }
};

// 更新人员信息
export const editUser = async (id, data) => {
    const response = await request({
        url: `/personnel/${id}`,
        method: 'PUT',
        data
    })
    if (!response.ok) {
        throw new Error('更新失败，服务器返回错误状态');
    }
}

// 删除人员
export const deleteUser = async (id) => {
    const response = await request({
        url: `/personnel/${id}`,
        method: 'DELETE'
    });

    if (!response.ok) {
        // 确保在尝试解析JSON之前，响应状态是OK的
        throw new Error('删除失败，服务器返回错误状态');
    }
    if (response.status === 204) {
        return {message: '删除成功，无返回数据'};
    }
}

export const login = async (loginParam) => {
    return request({
        url: '/users/login',
        method: 'GET',
        params: loginParam
    });
}