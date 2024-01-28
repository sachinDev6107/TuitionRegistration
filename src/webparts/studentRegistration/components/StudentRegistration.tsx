import * as React from 'react';
import { IStudentRegistrationProps } from './IStudentRegistrationProps';
import { Card } from 'react-bootstrap';


export default class StudentRegistration extends React.Component<IStudentRegistrationProps, {}> {
  
  constructor(props: IStudentRegistrationProps){
    super(props);

  }
  
  public render(): React.ReactElement<IStudentRegistrationProps> {

    return (
      <>
      <Card className='mb-4'>
      <Card.Header>General Info</Card.Header>
      <Card.Body>
        
      </Card.Body>
      </Card>
      </>   
    );
  }
}
