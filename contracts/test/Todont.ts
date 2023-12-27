import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { assert } from "chai";
import { ethers } from "hardhat";

describe("Todont", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const Contract = await ethers.getContractFactory('Todont');
    return await Contract.deploy();
  }

  describe("Test", () => {
    it('Should add task', async () => {
      const contract = await loadFixture(deploy);
      const added = await contract.addTask('Some task');
      assert(added, 'Task was not added');
    });

    it('Should delete task', async () => {
      const contract = await loadFixture(deploy);
      await contract.addTask('Some task');
      await contract.deleteTask(1);
      const tasks = await contract.getTasks();
      assert(tasks.length == 0, 'Task not deleted');
    });

    it('Should increment task', async () => {
      const contract = await loadFixture(deploy);
      await contract.addTask('Some task');
      await contract.incrementTask(1);
      const task = await contract.getTask(1);
      assert(task && task.count == 1n, 'Task count is not 1');
    });

    it('Should get tasks', async () => {
      const contract = await loadFixture(deploy);
      await contract.addTask('Task 1');
      await contract.addTask('Task 2');
      const tasks = await contract.getTasks();
      assert(tasks && tasks.length == 2, 'Tasks length not 2');
    });

    it('Should be ordered by newest first', async () => {
      const contract = await loadFixture(deploy);
      await contract.addTask('Task 1');
      await contract.addTask('Task 2');
      const tasks = await contract.getTasks();
      assert(tasks[0].id == 2n, 'Task 1 id not 2');
      assert(tasks[1].id == 1n, 'Task 2 id not 1');
    });

    it('Should not include deleted tasks', async () => {
      const contract = await loadFixture(deploy);
      await contract.addTask('Task 1');
      await contract.addTask('Task 2');
      await contract.addTask('Task 3');
      await contract.deleteTask(2);
      const tasks = await contract.getTasks();
      assert(tasks && tasks.length == 2, 'Tasks length not 2');
      assert(tasks[0].id == 3n, 'Task 1 id not 3');
      assert(tasks[1].id == 1n, 'Task 2 id not 1');
    });

    it('Should handle no tasks', async () => {
      const contract = await loadFixture(deploy);
      const tasks = await contract.getTasks();
      assert(tasks && tasks.length == 0, 'Tasks length not 0');
    });
  });
});
