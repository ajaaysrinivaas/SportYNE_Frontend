// services/topicService.ts
import { Topic, SubTopic, Post } from "../models/topics";

export class TopicService {
  async ListTopics(): Promise<Topic[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/drive/structure`
    );
    if (!response.ok) {
      throw new Error(`Error fetching topics: ${response.statusText}`);
    }
    return await response.json();
  }

  async GetSubTopics(topicName: string): Promise<Topic["subTopics"]> {
    const topics = await this.ListTopics();
    const topic = topics.find(
      (t) => t.name.toLowerCase() === topicName.toLowerCase()
    );
    return topic ? topic.subTopics : [];
  }

  async GetLatestPosts(topicName: string, count: number = 5): Promise<Post[]> {
    const subTopics = await this.GetSubTopics(topicName);
    // Assuming each subTopic has a "posts" property of type Post[]
    const allPosts: Post[] = subTopics.flatMap((subTopic: SubTopic) => subTopic.posts);
    return allPosts.slice(0, count);
  }

  async GetPostContent(topicName: string, postId: string): Promise<string> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/drive/file/html/${postId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching post content: ${response.statusText}`);
    }
    return await response.text();
  }

  private static instance: TopicService;
  public static getInstance(): TopicService {
    if (!TopicService.instance) {
      TopicService.instance = new TopicService();
    }
    return TopicService.instance;
  }
}
