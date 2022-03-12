import {useState} from 'react';
import {TreeModel} from 'tree-model';

const GenerateSolutions = ({professors, rooms, times, courses}) => 
{

    var constraintsTree = new TreeModel();
    var root = constraintsTree.parse({name:'root'});


}

function explore({parent, currentNode, availableProfessor, availableCourse, availableRoom, availableTime, listOfPossibleAssignments, constraints})
{
    //check constraints

    //check if all time slots and rooms are filled

    //recursive call

    //add current node to listOfPossibleAssignments
}