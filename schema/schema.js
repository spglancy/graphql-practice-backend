const graphql = require('graphql');
const Todo = require('../models/Todo');
const User = require('../models/User')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLBoolean, GraphQLList } = graphql

const todoType = new GraphQLObjectType({
  name: 'todo',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    author: { type: GraphQLID }
  })
});

const userType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    todos: {
      type: new GraphQLList(todoType),
      resolve(parent, args) {
        return Todo.find({ author: parent.id })
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: {
      type: todoType,
      args: {
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean },
        author: { type: GraphQLID }
      },
      resolve(parent, args) {
        // use mongoose to mutate
        const todo = new Todo({
          title: args.title,
          completed: args.completed,
          author: args.author
        })
        return todo.save()
      }
    },
    updateTodo: {
      type: todoType,
      args: {
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        // db query
        Todo.findOne({ title: args.title })
          .then(todo => {
            todo.completed = args.completed
            return todo.save()
          })
      }
    },
    deleteTodo: {
      type: todoType,
      args: {
        title: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Todo.findOneAndDelete({ title: args.title })
      }
    },
    addUser: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        user = new User({
          name: args.name,
          password: args.password
        })
        return user.save()
      }
    }
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    todo: {
      type: todoType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        // db query
        return Todo.findById(args.id)
      }
    },
    user: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        if (args.id != null) {
          return User.findById(args.id)
        }
        return User.findOne({ name: args.name, password: args.password })
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})